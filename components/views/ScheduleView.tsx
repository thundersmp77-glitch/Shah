'use client';

import React, { useState } from 'react';
import { useStudentData } from '@/lib/StudentContext';
import { StudyBlock } from '@/lib/types';
import { Plus, Trash2, Clock, Trash } from 'lucide-react';

export function ScheduleView() {
  const { schedule, addStudyBlock, deleteStudyBlock } = useStudentData();
  const [isAdding, setIsAdding] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;
    addStudyBlock({ subject, dayOfWeek, startTime, endTime });
    setSubject('');
    setIsAdding(false);
  };

  const getDaySchedule = (dayIndex: number) => {
    return schedule
      .filter(s => s.dayOfWeek === dayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-500 mt-1">Manage your classes and study blocks.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Block
        </button>
      </div>

      {isAdding && (
         <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">Add Schedule Block</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select 
                  value={dayOfWeek} 
                  onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
                >
                  {days.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject / Class</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required
                  placeholder="e.g., Biology 101"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
        {days.map((dayName, index) => {
          // We can optionally skip Sunday and Saturday if they are empty, but let's show all week.
          const dayBlocks = getDaySchedule(index);
          const isToday = new Date().getDay() === index;

          return (
            <div key={index} className={`flex flex-col bg-white rounded-2xl border ${isToday ? 'border-black shadow-md relative' : 'border-gray-200'}`}>
              {isToday && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full z-10">
                  Today
                </div>
              )}
              <div className={`p-3 text-center border-b border-gray-100 bg-gray-50/50 rounded-t-2xl ${isToday ? 'pt-4' : ''}`}>
                <h3 className={`font-semibold ${isToday ? 'text-black' : 'text-gray-700'}`}>{dayName.substring(0, 3)}</h3>
              </div>
              
              <div className="p-2 space-y-2 flex-grow min-h-[150px]">
                {dayBlocks.length > 0 ? (
                  dayBlocks.map(block => (
                    <div key={block.id} className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 text-sm group relative">
                      <div className="font-medium text-blue-900 leading-tight mb-1">{block.subject}</div>
                      <div className="text-blue-700/80 text-xs flex items-center gap-1 font-mono">
                        {block.startTime} - {block.endTime}
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStudyBlock(block.id);
                        }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-white rounded text-red-500 hover:bg-red-50 transition-all shadow-sm"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full flex items-center justify-center p-4">
                     <span className="text-gray-300 text-xs font-medium">Free</span>
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
