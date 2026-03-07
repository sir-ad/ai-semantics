/**
 * G-Lang Parser
 * Parses G-Lang syntax into an AST
 */
import type { ParserOptions, ParseResult } from './types';
export declare class GLangParser {
    private validator;
    private options;
    private buffer;
    constructor(options?: ParserOptions);
    /**
     * Parse complete G-Lang string into AST
     */
    parse(input: string): ParseResult;
    /**
     * Parse an incoming chunk of G-Lang stream
     */
    parseChunk(chunk: string, isDone?: boolean): ParseResult;
    reset(): void;
    /**
     * Tokenize current buffer safely
     */
    private lexBuffer;
    /**
     * Parse tokens into AST
     */
    private parseTokens;
}
/**
 * Create a parser instance
 */
export declare function createParser(options?: ParserOptions): GLangParser;
//# sourceMappingURL=parser.d.ts.map