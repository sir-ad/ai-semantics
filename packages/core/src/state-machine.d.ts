/**
 * State Machine
 * Manages state transitions for primitives
 */
import type { StateMachineConfig, StateChangeEvent } from './types';
export declare class StateMachine {
    private config;
    private current;
    private history;
    private listeners;
    constructor(config: StateMachineConfig);
    /**
     * Transition to a new state
     */
    transition(event: string, payload?: Record<string, unknown>): StateChangeEvent;
    /**
     * Check if a transition is valid
     */
    canTransition(event: string): boolean;
    /**
     * Get current state
     */
    getState(): string;
    /**
     * Get state history
     */
    getHistory(): string[];
    /**
     * Reset to initial state
     */
    reset(): void;
    /**
     * Subscribe to state changes
     */
    on(event: string, callback: (event: StateChangeEvent) => void): () => void;
    /**
     * Emit an event
     */
    private emit;
}
/**
 * Pre-built state machines for common primitives
 */
export declare const STATE_MACHINES: {
    readonly stream: {
        readonly initial: "idle";
        readonly states: readonly ["idle", "generating", "paused", "resuming", "complete", "error"];
        readonly transitions: {
            readonly idle: {
                readonly start: "generating";
            };
            readonly generating: {
                readonly chunk: "generating";
                readonly pause: "paused";
                readonly complete: "complete";
                readonly error: "error";
            };
            readonly paused: {
                readonly resume: "resuming";
                readonly cancel: "idle";
            };
            readonly resuming: {
                readonly resume: "generating";
                readonly error: "error";
            };
            readonly complete: {
                readonly start: "generating";
            };
            readonly error: {
                readonly retry: "generating";
                readonly cancel: "idle";
            };
        };
    };
    readonly tool: {
        readonly initial: "pending";
        readonly states: readonly ["pending", "running", "complete", "skipped", "error", "retry", "cancelled"];
        readonly transitions: {
            readonly pending: {
                readonly start: "running";
                readonly skip: "skipped";
                readonly cancel: "cancelled";
            };
            readonly running: {
                readonly complete: "complete";
                readonly error: "error";
                readonly cancel: "cancelled";
            };
            readonly error: {
                readonly retry: "retry";
                readonly cancel: "cancelled";
            };
            readonly retry: {
                readonly retry: "running";
                readonly cancel: "cancelled";
            };
            readonly complete: {
                readonly start: "running";
            };
            readonly skipped: {};
            readonly cancelled: {};
        };
    };
    readonly approve: {
        readonly initial: "pending";
        readonly states: readonly ["pending", "showing", "approved", "denied", "expired", "executing", "complete"];
        readonly transitions: {
            readonly pending: {
                readonly show: "showing";
                readonly expire: "expired";
            };
            readonly showing: {
                readonly approve: "approved";
                readonly deny: "denied";
                readonly expire: "expired";
            };
            readonly approved: {
                readonly execute: "executing";
            };
            readonly executing: {
                readonly complete: "complete";
            };
            readonly denied: {};
            readonly expired: {};
            readonly complete: {};
        };
    };
    readonly form: {
        readonly initial: "idle";
        readonly states: readonly ["idle", "editing", "validating", "submitting", "success", "error"];
        readonly transitions: {
            readonly idle: {
                readonly edit: "editing";
            };
            readonly editing: {
                readonly validate: "validating";
                readonly submit: "submitting";
            };
            readonly validating: {
                readonly success: "editing";
                readonly error: "error";
                readonly submit: "submitting";
            };
            readonly submitting: {
                readonly success: "success";
                readonly error: "error";
            };
            readonly success: {
                readonly reset: "idle";
            };
            readonly error: {
                readonly edit: "editing";
                readonly submit: "submitting";
            };
        };
    };
    readonly data: {
        readonly initial: "loading";
        readonly states: readonly ["loading", "ready", "error", "updating"];
        readonly transitions: {
            readonly loading: {
                readonly load: "ready";
                readonly error: "error";
            };
            readonly ready: {
                readonly update: "updating";
            };
            readonly updating: {
                readonly load: "ready";
                readonly error: "error";
            };
            readonly error: {
                readonly retry: "loading";
            };
        };
    };
};
/**
 * Create a state machine for a primitive
 */
export declare function createStateMachine(primitive: keyof typeof STATE_MACHINES): StateMachine;
//# sourceMappingURL=state-machine.d.ts.map