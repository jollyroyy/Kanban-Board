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
  bgGradient: string;
  glowColor: string;
  borderColor: string;
  headerColor: string;
  emoji: string;
}

export const COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    dotColor: 'bg-pink-400',
    bgGradient: 'column-bg-backlog',
    glowColor: 'glow-pink',
    borderColor: 'border-pink-200/60',
    headerColor: 'text-pink-700',
    emoji: '📋',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    dotColor: 'bg-yellow-400',
    bgGradient: 'column-bg-inprogress',
    glowColor: 'glow-yellow',
    borderColor: 'border-yellow-200/60',
    headerColor: 'text-yellow-700',
    emoji: '⚡',
  },
  {
    id: 'completed',
    title: 'Completed',
    dotColor: 'bg-emerald-400',
    bgGradient: 'column-bg-completed',
    glowColor: 'glow-green',
    borderColor: 'border-emerald-200/60',
    headerColor: 'text-emerald-700',
    emoji: '✅',
  },
];
