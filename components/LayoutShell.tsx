'use client';

import React, { useState } from 'react';
import { Home, CheckSquare, Calendar, Sun, Menu, X, BookOpen, Search, Folder } from 'lucide-react';

export interface LayoutShellProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'assignments' | 'schedule' | 'routine' | 'search' | 'resources';
  setActiveTab: (tab: 'dashboard' | 'assignments' | 'schedule' | 'routine' | 'search' | 'resources') => void;
}

export function LayoutShell({ children, activeTab, setActiveTab }: LayoutShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'routine', label: 'Routine', icon: Sun },
    { id: 'search', label: 'Quick Search', icon: Search },
    { id: 'resources', label: 'My Resources', icon: Folder },
  ] as const;

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Mobile nav header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-1 rounded-md">
            <BookOpen size={18} />
          </div>
          <span className="font-semibold list-none">StudentHub</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">StudentHub</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-white border-b border-gray-200 z-40 p-4 shadow-lg animate-in slide-in-from-top-2">
           <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-black text-white' 
                      : 'text-gray-600'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
