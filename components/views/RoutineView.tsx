'use client';

import React, { useState } from 'react';
import { useStudentData } from '@/lib/StudentContext';
import { TimeOfDay, RoutineTask } from '@/lib/types';
import { format, subDays, addDays } from 'date-fns';
import { Sun, Moon, Coffee, Plus, Trash2, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';

export function RoutineView() {
  const { routines, addRoutineTask, deleteRoutineTask, toggleRoutineCompletion } = useStudentData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addRoutineTask({ title, time, timeOfDay });
    setTitle('');
    setIsAdding(false);
  };

  const getDayIcon = (part: TimeOfDay) => {
    switch(part) {
      case 'Morning': return <Coffee size={20} className="text-amber-600" />;
      case 'Afternoon': return <Sun size={20} className="text-orange-500" />;
      case 'Evening': return <Moon size={20} className="text-indigo-600" />;
    }
  };

  const sections: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daily Routines</h1>
          <p className="text-gray-500 mt-1">Build habits by completing your daily routine.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      {isAdding && (
         <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">Add new routine task</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Habit / Task</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  placeholder="e.g., Read for 20 mins"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part of day</label>
                  <select 
                    value={timeOfDay} 
                    onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-200">
        <button 
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{format(selectedDate, 'eeee')}</h2>
          <p className="text-gray-500 text-sm">{format(selectedDate, 'MMMM do, yyyy')}</p>
        </div>
        <button 
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map(section => {
           const sectionRoutines = routines
             .filter(r => r.timeOfDay === section)
             .sort((a, b) => a.time.localeCompare(b.time));
             
           return (
             <div key={section} className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
               <div className="border-b border-gray-100 p-5 flex items-center gap-3 bg-gray-50">
                 {getDayIcon(section)}
                 <h2 className="font-semibold text-lg">{section}</h2>
                 <span className="ml-auto text-sm text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                    {sectionRoutines.length} items
                 </span>
               </div>
               
               <div className="p-4 flex-1 space-y-3">
                 {sectionRoutines.length > 0 ? (
                   sectionRoutines.map(routine => {
                     const isDone = routine.completedDates.includes(selectedDateStr);
                     return (
                       <div key={routine.id} className="group relative">
                         <div 
                           className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                             isDone ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'
                           }`}
                           onClick={() => toggleRoutineCompletion(routine.id, selectedDateStr)}
                         >
                           <button className={`flex-shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-gray-300 group-hover:text-gray-400'}`}>
                             {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                           </button>
                           <div className="flex-1 min-w-0">
                             <h3 className={`font-medium truncate ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>{routine.title}</h3>
                             <p className="text-xs text-gray-500 font-mono mt-0.5">{routine.time}</p>
                           </div>
                           
                           {/* Delete button appears on hover */}
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               deleteRoutineTask(routine.id);
                             }}
                             className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all rounded-lg"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </div>
                     );
                   })
                 ) : (
                   <div className="text-gray-400 text-center py-8 text-sm">
                     Nothing assigned for {section.toLowerCase()}.
                   </div>
                 )}
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
