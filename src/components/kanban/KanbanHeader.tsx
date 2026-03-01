import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  onCreateTask: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const KanbanHeader = ({ onCreateTask, searchQuery, onSearchChange }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Kanban Board</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track and manage your development tasks</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 w-full sm:w-64"
          />
        </div>
        <Button onClick={onCreateTask} className="shrink-0">
          <Plus className="h-4 w-4 mr-1.5" />
          Create
        </Button>
      </div>
    </div>
  );
};

export default KanbanHeader;
