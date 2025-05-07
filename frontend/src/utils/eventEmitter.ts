// Simple event emitter for cross-component communication
type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events: Record<string, EventHandler[]> = {};

  // Subscribe to an event
  on(event: string, handler: EventHandler): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(h => h !== handler);
    };
  }

  // Emit an event with data
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(handler => handler(...args));
  }

  // Remove all handlers for an event
  off(event: string): void {
    delete this.events[event];
  }
}

// Create a singleton instance
const eventEmitter = new EventEmitter();

// Event types
export const EVENTS = {
  TAGS_UPDATED: 'tags_updated',
  POST_CREATED: 'post_created',
  POST_UPDATED: 'post_updated',
  POST_DELETED: 'post_deleted'
};

export default eventEmitter; 