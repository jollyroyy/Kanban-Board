import { useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTasks } from '@/hooks/useTasks';
import { COLUMNS, Task, TaskStatus } from '@/types/kanban';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import CreateTaskDialog from './CreateTaskDialog';
import { Loader2 } from 'lucide-react';

const fireCompletionConfetti = () => {
  const colors = ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f9a8d4', '#c084fc'];
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors,
    scalar: 1.1,
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      zIndex: 9999,
    });
  }, 200);
};

const KanbanBoard = () => {
  const { tasks, isLoading, createTask, updateTask, deleteTask, moveTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { backlog: [], in_progress: [], completed: [] };
    tasks.forEach(t => map[t.status]?.push(t));
    Object.values(map).forEach(arr => arr.sort((a, b) => a.position - b.position));
    return map;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (_event: DragOverEvent) => {};

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTaskData = tasks.find(t => t.id === activeId);
    if (!activeTaskData) return;

    // Determine target status
    let targetStatus: TaskStatus;
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      targetStatus = overTask.status;
    } else if (['backlog', 'in_progress', 'completed'].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      return;
    }

    const targetTasks = tasksByStatus[targetStatus];
    let newPosition: number;

    if (overTask) {
      newPosition = overTask.position;
    } else {
      newPosition = targetTasks.length;
    }

    if (activeTaskData.status !== targetStatus || activeTaskData.position !== newPosition) {
      if (targetStatus === 'completed' && activeTaskData.status !== 'completed') {
        fireCompletionConfetti();
      }
      moveTask.mutate({ taskId: activeId, newStatus: targetStatus, newPosition });
    }
  };

  const handleAddTask = (status: string) => {
    setDefaultStatus(status as TaskStatus);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSubmitTask = (data: any) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      createTask.mutate(data);
    }
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto pb-4 px-1">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByStatus[col.id]}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={(id) => deleteTask.mutate(id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          )}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitTask}
        defaultStatus={defaultStatus}
        editingTask={editingTask}
      />
    </>
  );
};

export default KanbanBoard;
