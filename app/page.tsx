'use client';

import { useState } from 'react';
import { LayoutShell, LayoutShellProps } from '@/components/LayoutShell';
import { DashboardView } from '@/components/views/DashboardView';
import { AssignmentsView } from '@/components/views/AssignmentsView';
import { RoutineView } from '@/components/views/RoutineView';
import { ScheduleView } from '@/components/views/ScheduleView';
import { SearchView } from '@/components/views/SearchView';
import { ResourcesView } from '@/components/views/ResourcesView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<LayoutShellProps['activeTab']>('dashboard');

  return (
    <LayoutShell activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-300 relative h-full">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'assignments' && <AssignmentsView />}
        {activeTab === 'routine' && <RoutineView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'resources' && <ResourcesView />}
      </div>
    </LayoutShell>
  );
}
