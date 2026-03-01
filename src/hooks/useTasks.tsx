import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/kanban';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      due_date?: string;
      tags?: string[];
    }) => {
      const maxPos = tasks
        .filter(t => t.status === (task.status || 'backlog'))
        .reduce((max, t) => Math.max(max, t.position), -1);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...task,
          user_id: user!.id,
          position: maxPos + 1,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const moveTask = useMutation({
    mutationFn: async ({ taskId, newStatus, newPosition }: {
      taskId: string;
      newStatus: TaskStatus;
      newPosition: number;
    }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return { tasks, isLoading, createTask, updateTask, deleteTask, moveTask };
};
