export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: string;
  message: string;
  resourceId: string;
  resourceType: string;
  read: boolean;
  createdAt: string;
  commentId?: string;
}

export interface NotificationCount {
  unreadCount: number;
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
} 