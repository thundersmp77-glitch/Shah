'use client';

import React from 'react';
import { useStudentData } from '@/lib/StudentContext';
import { format, isSameDay } from 'date-fns';
import { CheckCircle2, Circle, Clock, CheckSquare, Calendar, AlertCircle } from 'lucide-react';

export function DashboardView() {
  const { assignments, routines, toggleRoutineCompletion } = useStudentData();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const todaysRoutines = routines;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Good {format(today, 'a') === 'AM' ? 'Morning' : 'Afternoon'}</h1>
        <p className="text-gray-500 mt-1">Here is an overview of what&apos;s happening today, {format(today, 'EEEE, MMMM do')}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
           <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
            <CheckSquare size={24} />
           </div>
           <div>
            <p className="text-gray-500 text-sm font-medium">Pending Assignments</p>
            <p className="text-2xl font-bold">{assignments.filter(a => a.status !== 'completed').length}</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4">
           <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full">
            <CheckCircle2 size={24} />
           </div>
           <div>
            <p className="text-gray-500 text-sm font-medium">Routines Completed</p>
            <p className="text-2xl font-bold">
              {routines.filter(r => r.completedDates.includes(todayStr)).length} / {routines.length}
            </p>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 p-5 flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> 
              Upcoming Assignments
            </h2>
          </div>
          <div className="p-2">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{assignment.course}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      assignment.priority === 'high' ? 'bg-red-50 text-red-700' :
                      assignment.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {assignment.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-end">
                      <Clock size={12} />
                      {format(new Date(assignment.dueDate), 'MMM do')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <CheckCircle2 size={32} className="text-gray-300 mb-2" />
                <p>All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Routine */}
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 p-5">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CheckSquare size={18} className="text-gray-400" />
              Today&apos;s Routine
            </h2>
          </div>
          <div className="p-4 space-y-3">
             {todaysRoutines.length > 0 ? (
               todaysRoutines.map(routine => {
                 const isDone = routine.completedDates.includes(todayStr);
                 return (
                   <div 
                     key={routine.id} 
                     className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                       isDone ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                     }`}
                     onClick={() => toggleRoutineCompletion(routine.id, todayStr)}
                   >
                     <button className={`flex-shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-gray-300 hover:text-gray-400'}`}>
                       {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                     </button>
                     <div className="flex-1">
                       <h3 className={`font-medium ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{routine.title}</h3>
                       <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock size={10} /> {routine.time} 
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {routine.timeOfDay}
                        </span>
                       </div>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="p-8 text-center text-gray-500">
                 No routines set for today.
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
