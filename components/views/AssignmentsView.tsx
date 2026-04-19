'use client';

import React, { useState } from 'react';
import { useStudentData } from '@/lib/StudentContext';
import { Priority, Status, Assignment } from '@/lib/types';
import { format } from 'date-fns';
import { Plus, Trash2, Clock, CheckCircle2, ChevronDown, Calendar as CalendarIcon, BookOpen, AlertCircle } from 'lucide-react';

export function AssignmentsView() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useStudentData();
  const [isAdding, setIsAdding] = useState(false);
  
  // New assignment form state
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !course) return;
    
    addAssignment({
      title,
      course,
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status: 'pending'
    });
    
    setTitle('');
    setCourse('');
    setIsAdding(false);
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const pending = assignments.filter(a => a.status !== 'completed').sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completed = assignments.filter(a => a.status === 'completed').sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assignments</h1>
          <p className="text-gray-500 mt-1">Keep track of your coursework and deadlines.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Assignment
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-lg mb-4">Add New Assignment</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  placeholder="e.g., Chapter 4 Essay"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course subject</label>
                <input 
                  type="text" 
                  value={course} 
                  onChange={(e) => setCourse(e.target.value)} 
                  required
                  placeholder="e.g., History 101"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-black focus:border-black outline-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        
        {/* Pending Section */}
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-amber-500" />
            Active Tasks ({pending.length})
          </h2>
          {pending.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {pending.map(assignment => (
                <div key={assignment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg text-gray-900">{assignment.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border border-opacity-50 ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><BookOpen size={14} /> {assignment.course}</span>
                      <span className="flex items-center gap-1.5"><CalendarIcon size={14} /> Due: {format(new Date(assignment.dueDate), 'MMM do, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2 md:mt-0">
                    <select
                      value={assignment.status}
                      onChange={(e) => updateAssignment(assignment.id, { status: e.target.value as Status })}
                      className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="pending">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <button 
                      onClick={() => updateAssignment(assignment.id, { status: 'completed' })}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Mark as done"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-gray-500 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
               <CheckCircle2 size={40} className="mx-auto text-gray-300 mb-3" />
               <p className="font-medium">No pending assignments</p>
               <p className="text-sm mt-1">You&apos;re all caught up! Time to relax or study ahead.</p>
             </div>
          )}
        </div>

        {/* Completed Section */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
              <CheckCircle2 size={20} className="text-emerald-500" />
              Completed ({completed.length})
            </h2>
            <div className="grid grid-cols-1 gap-3 opacity-70">
              {completed.map(assignment => (
                <div key={assignment.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-500 line-through">{assignment.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>{assignment.course}</span>
                      <span>Was due: {format(new Date(assignment.dueDate), 'MMM do')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateAssignment(assignment.id, { status: 'pending' })}
                      className="text-sm text-gray-500 hover:text-black underline px-2 py-1"
                    >
                      Undo
                    </button>
                    <button 
                      onClick={() => deleteAssignment(assignment.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
