import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const buttonVariants = {
    primary: {
        base: "bg-teal-600 text-white border-2 border-teal-600",
        hover: "hover:bg-teal-700 hover:border-teal-700",
        focus: "focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50",
        active: "active:bg-teal-800 active:border-teal-800",
        disabled: "disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
    },
    secondary: {
        base: "bg-gray-100 text-gray-900 border-2 border-gray-300",
        hover: "hover:bg-gray-200 hover:border-gray-400",
        focus: "focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50",
        active: "active:bg-gray-300 active:border-gray-500",
        disabled: "disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
    },
    outline: {
        base: "bg-white text-teal-700 border-2 border-teal-300",
        hover: "hover:bg-teal-50 hover:border-teal-400",
        focus: "focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50",
        active: "active:bg-teal-100 active:border-teal-500",
        disabled: "disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
    },
    ghost: {
        base: "bg-transparent text-gray-700 border-2 border-transparent",
        hover: "hover:bg-gray-100 hover:text-gray-900",
        focus: "focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50",
        active: "active:bg-gray-200",
        disabled: "disabled:text-gray-400 disabled:cursor-not-allowed"
    },
    destructive: {
        base: "bg-red-600 text-white border-2 border-red-600",
        hover: "hover:bg-red-700 hover:border-red-700",
        focus: "focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
        active: "active:bg-red-800 active:border-red-800",
        disabled: "disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
    },
    success: {
        base: "bg-green-600 text-white border-2 border-green-600",
        hover: "hover:bg-green-700 hover:border-green-700",
        focus: "focus:ring-2 focus:ring-green-500 focus:ring-opacity-50",
        active: "active:bg-green-800 active:border-green-800",
        disabled: "disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
    }
};

const buttonSizes = {
    sm: "px-3 py-2 text-sm font-medium",
    md: "px-4 py-2.5 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
    xl: "px-8 py-4 text-lg font-bold"
};

export const FormButton = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    children,
    ...props
}, ref) => {
    const variantStyles = buttonVariants[variant];
    const isDisabled = disabled || loading;
    
    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={cn(
                // Base styles
                "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-in-out",
                "focus:outline-none focus:ring-offset-2 focus:ring-offset-white",
                
                // Size styles
                buttonSizes[size],
                
                // Variant styles
                variantStyles.base,
                !isDisabled && variantStyles.hover,
                !isDisabled && variantStyles.focus,
                !isDisabled && variantStyles.active,
                variantStyles.disabled,
                
                // Full width
                fullWidth && "w-full",
                
                // Transform on interaction
                !isDisabled && "transform hover:scale-[1.02] active:scale-[0.98]",
                
                className
            )}
            {...props}
        >
            {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {!loading && leftIcon && (
                <span className="flex-shrink-0">{leftIcon}</span>
            )}
            <span className={cn(loading && "opacity-70")}>
                {children}
            </span>
            {!loading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
});

FormButton.displayName = 'FormButton';

// Icon Button Component
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
    icon: React.ReactNode;
    'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon,
    variant = 'ghost',
    size = 'md',
    loading = false,
    className,
    disabled,
    'aria-label': ariaLabel,
    ...props
}, ref) => {
    const variantStyles = buttonVariants[variant];
    const isDisabled = disabled || loading;
    
    const sizeClasses = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-2.5",
        xl: "p-3"
    };
    
    return (
        <button
            ref={ref}
            disabled={isDisabled}
            aria-label={ariaLabel}
            className={cn(
                // Base styles
                "inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white",
                
                // Size styles
                sizeClasses[size],
                
                // Variant styles
                variantStyles.base,
                !isDisabled && variantStyles.hover,
                !isDisabled && variantStyles.focus,
                !isDisabled && variantStyles.active,
                variantStyles.disabled,
                
                // Transform on interaction
                !isDisabled && "transform hover:scale-110 active:scale-95",
                
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <span className="flex-shrink-0">{icon}</span>
            )}
        </button>
    );
});

IconButton.displayName = 'IconButton';