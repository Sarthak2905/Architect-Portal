import { cn } from "../../utils/cn";

const VARIANTS = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-white text-ink border border-border hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-muted hover:text-ink hover:bg-slate-100",
    danger: "bg-error text-white hover:opacity-90",
};

const SIZES = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3",
};

export const Button = ({
    variant = "primary",
    size = "md",
    className,
    children,
    disabled,
    ...props
}) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
                VARIANTS[variant],
                SIZES[size],
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};