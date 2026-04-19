'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Assignment, RoutineTask, StudyBlock } from './types';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

interface StudentContextType {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  routines: RoutineTask[];
  addRoutineTask: (task: Omit<RoutineTask, 'id' | 'completedDates'>) => void;
  updateRoutineTask: (id: string, task: Partial<RoutineTask>) => void;
  deleteRoutineTask: (id: string) => void;
  toggleRoutineCompletion: (id: string, date: string) => void;

  schedule: StudyBlock[];
  addStudyBlock: (block: Omit<StudyBlock, 'id'>) => void;
  deleteStudyBlock: (id: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const initialAssignments: Assignment[] = [
  { id: '1', title: 'Calculus Problem Set 3', course: 'Math 101', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), priority: 'high', status: 'pending' },
  { id: '2', title: 'History Essay Draft', course: 'History 202', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), priority: 'medium', status: 'in_progress' },
];

const initialRoutines: RoutineTask[] = [
  { id: '1', title: 'Review flashcards', time: '08:00', timeOfDay: 'Morning', completedDates: [] },
  { id: '2', title: 'Read 20 pages', time: '21:00', timeOfDay: 'Evening', completedDates: [] },
];

const initialSchedule: StudyBlock[] = [
  { id: '1', subject: 'Math Study Group', dayOfWeek: 1, startTime: '15:00', endTime: '16:30' },
  { id: '2', subject: 'Library time', dayOfWeek: 3, startTime: '10:00', endTime: '12:00' },
];

export function StudentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [schedule, setSchedule] = useState<StudyBlock[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const storedAssignments = localStorage.getItem('studenthub_assignments');
      const storedRoutines = localStorage.getItem('studenthub_routines');
      const storedSchedule = localStorage.getItem('studenthub_schedule');

      if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
      else setAssignments(initialAssignments);

      if (storedRoutines) setRoutines(JSON.parse(storedRoutines));
      else setRoutines(initialRoutines);

      if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
      else setSchedule(initialSchedule);
    } catch(e) {
      console.error('Failed to load from local storage', e);
    }
    setIsLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Save changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('studenthub_assignments', JSON.stringify(assignments));
      localStorage.setItem('studenthub_routines', JSON.stringify(routines));
      localStorage.setItem('studenthub_schedule', JSON.stringify(schedule));
    }
  }, [assignments, routines, schedule, isLoaded]);

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    setAssignments(prev => [...prev, { ...assignment, id: uuidv4() }]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(item => item.id !== id));
  };

  const addRoutineTask = (task: Omit<RoutineTask, 'id' | 'completedDates'>) => {
    setRoutines(prev => [...prev, { ...task, id: uuidv4(), completedDates: [] }]);
  };

  const updateRoutineTask = (id: string, updates: Partial<RoutineTask>) => {
    setRoutines(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteRoutineTask = (id: string) => {
    setRoutines(prev => prev.filter(item => item.id !== id));
  };

  const toggleRoutineCompletion = (id: string, dateStr: string) => {
    setRoutines(prev => prev.map(item => {
      if (item.id === id) {
        const isCompleted = item.completedDates.includes(dateStr);
        const newDates = isCompleted 
          ? item.completedDates.filter(d => d !== dateStr) 
          : [...item.completedDates, dateStr];
        return { ...item, completedDates: newDates };
      }
      return item;
    }));
  };

  const addStudyBlock = (block: Omit<StudyBlock, 'id'>) => {
    setSchedule(prev => [...prev, { ...block, id: uuidv4() }]);
  };
  
  const deleteStudyBlock = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  return (
    <StudentContext.Provider value={{
      assignments,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      routines,
      addRoutineTask,
      updateRoutineTask,
      deleteRoutineTask,
      toggleRoutineCompletion,
      schedule,
      addStudyBlock,
      deleteStudyBlock
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentData() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentData must be used within a StudentProvider');
  }
  return context;
}
