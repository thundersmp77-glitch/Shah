export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string; // ISO string 
  priority: Priority;
  status: Status;
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export interface RoutineTask {
  id: string;
  title: string;
  time: string; // HH:mm
  timeOfDay: TimeOfDay;
  completedDates: string[]; // YYYY-MM-DD format strings representing days it was done
}

export interface StudyBlock {
  id: string;
  subject: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}
