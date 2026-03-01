export type TaskStatus = 'backlog' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export const TASK_CATEGORIES = [
  'General', 'Personal', 'Work', 'Bug', 'Feature', 'Design', 'DevOps', 'Documentation'
] as const;

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  due_date: string | null;
  tags: string[];
  category: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  dotColor: string;
}

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', dotColor: 'bg-kanban-backlog' },
  { id: 'in_progress', title: 'In Progress', dotColor: 'bg-kanban-in-progress' },
  { id: 'completed', title: 'Completed', dotColor: 'bg-kanban-completed' },
];
