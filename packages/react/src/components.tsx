import React, { useRef, useEffect } from 'react';
import { useGrain } from './hooks';

export interface GrainStreamProps extends React.HTMLAttributes<HTMLDivElement> {
    content: string;
    theme?: Record<string, string>;
    onAction?: (action: string) => void;
}

export const GrainStream: React.FC<GrainStreamProps> = ({
    content,
    theme,
    onAction,
    className,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { render } = useGrain(containerRef, { theme, onAction });

    useEffect(() => {
        render(content);
    }, [content, render]);

    return <div ref={containerRef} className={className} {...props} />;
};
