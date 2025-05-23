
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const PageTitle = forwardRef((props, ref) => {
    const { action, children, className, ...otherProps } = props;

    if (!children) return null;

    return (
        <header
            ref={ref}
            className={cn("mb-8 min-h-10", className)}
            {...otherProps}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl text-foreground">{children}</h1>
                {action}
            </div>

            {props.subtitle && (
                <p className="text-base leading-8 text-surface-500">{props.subtitle}</p>
            )}
        </header>
    );
});