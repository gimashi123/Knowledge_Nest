import { useState, useEffect, useRef } from 'react';
import { BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/notification-context';
import { NotificationList } from '@/components/ui/notification-list';

export function NotificationBell() {
  const { unreadCount, fetchNotifications, loading, error } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const prevUnreadCount = useRef(unreadCount);
  
  // Fetch notifications immediately when component mounts
  useEffect(() => {
    console.log('NotificationBell mounted, fetching initial notifications');
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Track when unread count changes
  useEffect(() => {
    // Only animate when count increases
    if (unreadCount > prevUnreadCount.current) {
      console.log('Unread count increased from', prevUnreadCount.current, 'to', unreadCount);
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 3000);
      return () => clearTimeout(timer);
    }
    
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // Set up more frequent polling (every 15 seconds)
  useEffect(() => {
    console.log('Setting up polling for notifications');
    const intervalId = setInterval(() => {
      console.log('Polling for new notifications');
      fetchNotifications();
    }, 15000);
    
    return () => {
      console.log('Clearing notification polling interval');
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  // Handle error retry logic
  useEffect(() => {
    if (error && fetchAttempts < 3) {
      console.log(`Error detected, retry attempt ${fetchAttempts + 1}/3`);
      const timer = setTimeout(() => {
        fetchNotifications();
        setFetchAttempts(prev => prev + 1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, fetchAttempts, fetchNotifications]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      console.log('NotificationBell opened, refreshing notifications');
      // Refresh notifications when opening the dropdown
      fetchNotifications();
      // Reset fetch attempts when manually opening
      setFetchAttempts(0);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className={cn(
            "h-5 w-5", 
            shouldAnimate && "animate-wiggle",
            unreadCount > 0 && "text-primary",
            loading && "opacity-70"
          )} />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white",
              shouldAnimate && "animate-pulse"
            )}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 max-h-[calc(100vh-100px)] overflow-hidden p-0">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
} 