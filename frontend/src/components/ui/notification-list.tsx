import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Notification, NotificationType } from '@/types/notification';
import { useNotifications } from '@/contexts/notification-context';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Heart, 
  MessageSquare, 
  Trash2, 
  Bell, 
  Check, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationList() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    fetchNotifications,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const navigate = useNavigate();

  // Refresh notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read if it's not already
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to the appropriate resource
    if (notification.resourceType === 'SKILL_POST' && notification.resourceId) {
      navigate(`/skill-posts/${notification.resourceId}`);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NotificationType.LIKE:
        return <Heart className="h-4 w-4 text-red-500" />;
      case NotificationType.COMMENT:
      case NotificationType.COMMENT_REPLY:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Render content based on loading/error/empty state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="p-4 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Error loading notifications</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 flex items-center gap-1"
            onClick={() => fetchNotifications()}
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </Button>
        </div>
      );
    }
    
    if (!notifications || notifications.length === 0) {
      return (
        <div className="p-8 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No notifications yet</p>
        </div>
      );
    }
    
    return (
      <div>
        {notifications.map((notification) => (
          <div key={notification.id} className="group">
            <div 
              className={cn(
                "p-3 hover:bg-accent/50 relative flex gap-3 transition-colors cursor-pointer",
                !notification.read && "bg-accent/20"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              {!notification.read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
              )}
              
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm", !notification.read && "font-medium")}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs flex items-center gap-1 h-8 px-2"
              onClick={() => markAllAsRead()}
            >
              <Check className="h-3 w-3" />
              <span>Mark all as read</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => fetchNotifications()}
            disabled={loading}
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {renderContent()}
      </ScrollArea>
    </div>
  );
} 