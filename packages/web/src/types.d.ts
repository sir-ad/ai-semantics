/**
 * Web Adapter Types
 */
export interface WebAdapterConfig {
    theme?: Record<string, string>;
    classPrefix?: string;
    namespace?: string;
}
export interface RenderOptions {
    container?: HTMLElement | string;
    position?: 'replace' | 'append' | 'prepend' | 'before' | 'after';
    animate?: boolean;
}
export interface WebComponentConfig {
    name: string;
    shadow?: boolean;
    style?: string;
}
//# sourceMappingURL=types.d.ts.map