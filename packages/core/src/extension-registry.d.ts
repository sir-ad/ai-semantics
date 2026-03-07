/**
 * Extension Registry
 * Manages custom primitives and extensions
 */
import type { Extension, PrimitiveDefinition } from './types';
export declare class ExtensionRegistry {
    private extensions;
    private primitiveOverrides;
    /**
     * Register an extension
     */
    register(extension: Extension): void;
    /**
     * Unregister an extension
     */
    unregister(name: string): void;
    /**
     * Get an extension by name
     */
    get(name: string): Extension | undefined;
    /**
     * Get all registered extensions
     */
    getAll(): Extension[];
    /**
     * Get primitive definition
     */
    getPrimitive(name: string): PrimitiveDefinition | undefined;
    /**
     * Get all custom primitives
     */
    getAllPrimitives(): Record<string, PrimitiveDefinition>;
    /**
     * Check if primitive exists
     */
    hasPrimitive(name: string): boolean;
    /**
     * Clear all extensions
     */
    clear(): void;
}
/**
 * Built-in primitives
 */
export declare const BUILTIN_PRIMITIVES: Record<string, PrimitiveDefinition>;
/**
 * Create a new extension registry
 */
export declare function createExtensionRegistry(): ExtensionRegistry;
//# sourceMappingURL=extension-registry.d.ts.map