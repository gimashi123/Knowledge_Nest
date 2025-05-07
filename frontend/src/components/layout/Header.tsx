import { useAuth } from '@/contexts/auth-context';
import { NotificationBell } from '@/components/ui/notification-bell';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar?: () => void;
  showMenuButton?: boolean;
}

export function Header({ toggleSidebar, showMenuButton = false }: HeaderProps) {
  const { currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center bg-background border-b px-4 md:px-6">
      <div className="flex items-center flex-1 gap-2">
        {showMenuButton && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold hidden md:block">Knowledge Nest</h1>
      </div>
      
      <div className="flex items-center">
        {currentUser && <NotificationBell />}
      </div>
    </header>
  );
} 