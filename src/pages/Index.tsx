import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppSidebar from '@/components/kanban/AppSidebar';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import KanbanHeader from '@/components/kanban/KanbanHeader';
import CreateTaskDialog from '@/components/kanban/CreateTaskDialog';
import { useTasks } from '@/hooks/useTasks';
import Auth from './Auth';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [headerDialogOpen, setHeaderDialogOpen] = useState(false);
  const { createTask } = useTasks();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <div className="flex min-h-screen premium-bg">
      <AppSidebar />
      <main className="flex-1 flex flex-col p-6 lg:p-8 overflow-hidden">
        <KanbanHeader
          onCreateTask={() => setHeaderDialogOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </main>
      <CreateTaskDialog
        open={headerDialogOpen}
        onOpenChange={setHeaderDialogOpen}
        onSubmit={(data) => {
          createTask.mutate(data);
        }}
      />
    </div>
  );
};

export default Index;
