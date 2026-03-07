/**
 * Web Adapter for Grain
 * Renders G-Lang to semantic HTML
 */
import type { WebAdapterConfig, RenderOptions } from './types';
export declare class WebAdapter {
    private parser;
    private eventBus;
    private config;
    constructor(config?: WebAdapterConfig);
    /**
     * Render G-Lang to HTML
     */
    render(grain: string, options?: RenderOptions): HTMLElement | null;
    /**
     * Render G-Lang AST to HTML DOM Elements
     */
    private renderAST;
    /**
     * Register Native Web Components
     */
    registerCustomElements(): void;
    on(event: string, callback: (payload: unknown) => void): () => void;
    getThemeCSS(): string;
}
export declare function createWebAdapter(config?: WebAdapterConfig): WebAdapter;
export default WebAdapter;
//# sourceMappingURL=index.d.ts.map