/**
 * Event Bus
 * Simple event emitter for AI Semantics
 */
import type { EventCallback, EventPayload } from './types';
export declare class EventBus {
    private events;
    private onceEvents;
    /**
     * Subscribe to an event
     */
    on(event: string, callback: EventCallback): () => void;
    /**
     * Subscribe to an event once
     */
    once(event: string, callback: EventCallback): () => void;
    /**
     * Unsubscribe from an event
     */
    off(event: string, callback: EventCallback): void;
    /**
     * Emit an event
     */
    emit(event: string, payload?: EventPayload): void;
    /**
     * Remove all listeners for an event
     */
    clear(event?: string): void;
    /**
     * Get listener count for an event
     */
    listenerCount(event: string): number;
    /**
     * Get all event names
     */
    eventNames(): string[];
}
/**
 * Create a new event bus
 */
export declare function createEventBus(): EventBus;
//# sourceMappingURL=event-bus.d.ts.map