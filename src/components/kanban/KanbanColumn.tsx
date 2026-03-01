import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column } from '@/types/kanban';
import TaskCard from './TaskCard';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  column: Column;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const KanbanColumn = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-[320px] max-w-[360px] w-full">
      {/* Column wrapper with colored glass background */}
      <div
        className={cn(
          'flex flex-col flex-1 rounded-2xl border backdrop-blur-sm transition-all duration-300',
          column.bgGradient,
          column.borderColor,
          isOver && 'scale-[1.01] shadow-2xl',
        )}
        style={{ minHeight: 200 }}
      >
        {/* Column header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{column.emoji}</span>
            <div className={cn('h-2.5 w-2.5 rounded-full shadow-sm', column.dotColor)} />
            <h2 className={cn('font-bold text-sm tracking-wide', column.headerColor)}>
              {column.title}
            </h2>
            <span
              className={cn(
                'text-xs font-semibold rounded-full px-2 py-0.5 backdrop-blur-sm',
                column.id === 'backlog' && 'bg-pink-100/80 text-pink-600 border border-pink-200/60',
                column.id === 'in_progress' && 'bg-yellow-100/80 text-yellow-600 border border-yellow-200/60',
                column.id === 'completed' && 'bg-emerald-100/80 text-emerald-600 border border-emerald-200/60',
              )}
            >
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => onAddTask(column.id)}
            className={cn(
              'h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
              column.id === 'backlog' && 'text-pink-400 hover:bg-pink-100/80 hover:text-pink-600',
              column.id === 'in_progress' && 'text-yellow-400 hover:bg-yellow-100/80 hover:text-yellow-600',
              column.id === 'completed' && 'text-emerald-400 hover:bg-emerald-100/80 hover:text-emerald-600',
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Subtle divider */}
        <div
          className={cn(
            'mx-4 mb-3 h-px opacity-40',
            column.id === 'backlog' && 'bg-pink-300',
            column.id === 'in_progress' && 'bg-yellow-300',
            column.id === 'completed' && 'bg-emerald-300',
          )}
        />

        {/* Cards container */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 space-y-3 px-3 pb-4 transition-all duration-200 kanban-scrollbar overflow-y-auto',
            isOver && 'ring-2 ring-inset rounded-b-2xl',
            isOver && column.id === 'backlog' && 'ring-pink-300/60 bg-pink-50/30',
            isOver && column.id === 'in_progress' && 'ring-yellow-300/60 bg-yellow-50/30',
            isOver && column.id === 'completed' && 'ring-emerald-300/60 bg-emerald-50/30',
          )}
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-2 h-24 rounded-xl border border-dashed text-xs',
                column.id === 'backlog' && 'border-pink-200/60 text-pink-300',
                column.id === 'in_progress' && 'border-yellow-200/60 text-yellow-300',
                column.id === 'completed' && 'border-emerald-200/60 text-emerald-300',
              )}
            >
              <Sparkles className="h-4 w-4 opacity-50" />
              <span>Drop tasks here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
