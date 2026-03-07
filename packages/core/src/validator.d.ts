/**
 * Validator
 * Validates AST against specification
 */
import type { ASTNode, ValidationResult, PrimitiveDefinition } from './types';
export declare class Validator {
    private primitives;
    constructor();
    /**
     * Register custom primitive
     */
    registerPrimitive(name: string, definition: PrimitiveDefinition): void;
    /**
     * Validate AST
     */
    validate(ast: ASTNode): ValidationResult;
    /**
     * Validate a single node
     */
    private validateNode;
    /**
     * Validate G-Lang string directly
     */
    validateString(grainString: string): ValidationResult;
}
/**
 * Create a validator instance
 */
export declare function createValidator(): Validator;
//# sourceMappingURL=validator.d.ts.map