import { useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useSkillPostNavigation } from '@/hooks/useSkillPostNavigation';
import { cn } from '@/lib/utils';

interface SkillPostSidebarItemProps {
  collapsed?: boolean;
}

export function SkillPostSidebarItem({ collapsed = false }: SkillPostSidebarItemProps) {
  const location = useLocation();
  const { goToSkillPosts } = useSkillPostNavigation();
  
  const isActive = location.pathname.startsWith('/skill-posts');
  
  return (
    <button
      onClick={goToSkillPosts}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 w-full transition-all",
        isActive 
          ? "bg-secondary text-secondary-foreground" 
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
      )}
    >
      <BookOpen className="h-5 w-5" />
      {!collapsed && <span>Skill Posts</span>}
    </button>
  );
} 