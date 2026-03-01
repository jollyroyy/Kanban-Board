import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column } from '@/types/kanban';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
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
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={cn('h-2.5 w-2.5 rounded-full', column.dotColor)} />
          <h2 className="font-semibold text-sm text-foreground">{column.title}</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 rounded-xl p-2 transition-colors duration-200 kanban-scrollbar overflow-y-auto',
          isOver && 'bg-primary/5 ring-2 ring-primary/20 ring-inset'
        )}
        style={{ minHeight: 100 }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
