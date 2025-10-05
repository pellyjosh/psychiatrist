import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BaseInputProps {
    label?: string;
    error?: string;
    success?: string;
    hint?: string;
    required?: boolean;
    className?: string;
    labelClassName?: string;
    containerClassName?: string;
}

// Consolidated TextInputProps; extend native input attributes but keep explicit design props
interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {
    success?: string;
}

interface SelectInputProps extends BaseInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    children: React.ReactNode;
}

interface TextareaInputProps extends BaseInputProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    name?: string;
    id?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    rows?: number;
    maxLength?: number;
    placeholder?: string;
}

interface CheckboxInputProps extends BaseInputProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

interface RadioInputProps extends BaseInputProps {
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

// Base input styles (restored after patch corruption)
const baseInputStyles = {
    base: "w-full rounded-lg border-2 transition-all duration-200 ease-in-out bg-white",
    size: "px-4 py-3 text-base",
    focus: "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    disabled: "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
    states: {
        default: "border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-teal-500",
        error: "border-red-400 text-gray-900 focus:border-red-500 focus:ring-red-500",
        success: "border-green-400 text-gray-900 focus:border-green-500 focus:ring-green-500"
    }
};

const labelStyles = {
    base: "block text-sm font-semibold mb-2",
    required: "after:content-['*'] after:ml-1 after:text-red-500",
    states: {
        default: "text-gray-800",
        error: "text-red-700",
        success: "text-green-700"
    }
};

// Text Input Component
export const FormInput = forwardRef<HTMLInputElement, TextInputProps>(({
    type = 'text',
    label,
    error,
    success,
    hint,
    required,
    className,
    labelClassName,
    containerClassName,
    disabled,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && (
                <label className={cn(
                    labelStyles.base,
                    labelStyles.states[state],
                    required && labelStyles.required,
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    className={cn(
                        baseInputStyles.base,
                        baseInputStyles.size,
                        baseInputStyles.focus,
                        baseInputStyles.disabled,
                        baseInputStyles.states[state],
                        isPassword && "pr-12",
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
});

FormInput.displayName = 'FormInput';

// Select Input Component
export const FormSelect = forwardRef<HTMLSelectElement, SelectInputProps>(({
    label,
    error,
    success,
    hint,
    required,
    className,
    labelClassName,
    containerClassName,
    disabled,
    children,
    ...props
}, ref) => {
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && (
                <label className={cn(
                    labelStyles.base,
                    labelStyles.states[state],
                    required && labelStyles.required,
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <select
                ref={ref}
                disabled={disabled}
                className={cn(
                    baseInputStyles.base,
                    baseInputStyles.size,
                    baseInputStyles.focus,
                    baseInputStyles.disabled,
                    baseInputStyles.states[state],
                    "cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
});

FormSelect.displayName = 'FormSelect';

// Textarea Input Component
export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaInputProps>(({
    label,
    error,
    success,
    hint,
    required,
    className,
    labelClassName,
    containerClassName,
    disabled,
    rows = 4,
    ...props
}, ref) => {
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && (
                <label className={cn(
                    labelStyles.base,
                    labelStyles.states[state],
                    required && labelStyles.required,
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                disabled={disabled}
                className={cn(
                    baseInputStyles.base,
                    baseInputStyles.size,
                    baseInputStyles.focus,
                    baseInputStyles.disabled,
                    baseInputStyles.states[state],
                    "resize-vertical min-h-[100px]",
                    className
                )}
                {...props}
            />
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';

// Checkbox Input Component
export const FormCheckbox = ({
    label,
    error,
    success,
    hint,
    required,
    className,
    labelClassName,
    containerClassName,
    disabled,
    checked,
    onChange,
    children,
    ...props
}: CheckboxInputProps) => {
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked)}
                    className={cn(
                        "h-5 w-5 rounded border-2 transition-all duration-200 ease-in-out cursor-pointer",
                        "focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        // Unchecked states
                        "border-teal-400 bg-white text-teal-600",
                        // Checked states - using accent-teal to override default blue
                        "checked:bg-teal-600 checked:border-teal-600 checked:text-white",
                        "hover:border-teal-500 hover:bg-teal-50",
                        // Error states
                        state === 'error' && "border-red-400 focus:ring-red-500 checked:bg-red-600 checked:border-red-600",
                        // Success states  
                        state === 'success' && "border-green-400 focus:ring-green-500 checked:bg-green-600 checked:border-green-600",
                        className
                    )}
                    style={{
                        accentColor: state === 'error' ? '#dc2626' : state === 'success' ? '#16a34a' : '#0d9488'
                    }}
                    {...props}
                />
                <div className="flex-1">
                    {(label || children) && (
                        <label className={cn(
                            "text-sm font-medium cursor-pointer",
                            labelStyles.states[state],
                            required && labelStyles.required,
                            labelClassName
                        )}>
                            {label || children}
                        </label>
                    )}
                </div>
            </div>
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm ml-8">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Radio Input Component
export const FormRadio = ({
    name,
    value,
    label,
    error,
    success,
    hint,
    required,
    className,
    labelClassName,
    containerClassName,
    disabled,
    checked,
    onChange,
    children,
    ...props
}: RadioInputProps) => {
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            <div className="flex items-start gap-3">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={cn(
                        "h-5 w-5 border-2 transition-all duration-200 ease-in-out cursor-pointer",
                        "focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        // Unchecked states
                        "border-teal-400 bg-white text-teal-600",
                        // Checked states - using accent-teal to override default blue
                        "checked:bg-teal-600 checked:border-teal-600 checked:text-white",
                        "hover:border-teal-500 hover:bg-teal-50",
                        // Error states
                        state === 'error' && "border-red-400 focus:ring-red-500 checked:bg-red-600 checked:border-red-600",
                        // Success states
                        state === 'success' && "border-green-400 focus:ring-green-500 checked:bg-green-600 checked:border-green-600",
                        className
                    )}
                    style={{
                        accentColor: state === 'error' ? '#dc2626' : state === 'success' ? '#16a34a' : '#0d9488'
                    }}
                    {...props}
                />
                <div className="flex-1">
                    {(label || children) && (
                        <label className={cn(
                            "text-sm font-medium cursor-pointer",
                            labelStyles.states[state],
                            required && labelStyles.required,
                            labelClassName
                        )}>
                            {label || children}
                        </label>
                    )}
                </div>
            </div>
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm ml-8">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Radio Group Helper Component
interface RadioGroupProps extends BaseInputProps {
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    children: React.ReactNode;
    direction?: 'horizontal' | 'vertical';
}

export const FormRadioGroup = ({
    label,
    error,
    success,
    hint,
    required,
    labelClassName,
    containerClassName,
    children,
    direction = 'vertical',
    ...props
}: RadioGroupProps) => {
    const state = error ? 'error' : success ? 'success' : 'default';
    
    return (
        <div className={cn("space-y-2", containerClassName)}>
            {label && (
                <label className={cn(
                    labelStyles.base,
                    labelStyles.states[state],
                    required && labelStyles.required,
                    labelClassName
                )}>
                    {label}
                </label>
            )}
            <div className={cn(
                "gap-4",
                direction === 'horizontal' ? "flex flex-wrap" : "space-y-3"
            )}>
                {children}
            </div>
            {(error || success || hint) && (
                <div className="flex items-start gap-2 text-sm">
                    {error && (
                        <>
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 font-medium">{error}</span>
                        </>
                    )}
                    {success && !error && (
                        <>
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700 font-medium">{success}</span>
                        </>
                    )}
                    {hint && !error && !success && (
                        <span className="text-gray-600">{hint}</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Phone Input Component (US Format)
export const FormPhoneUS = ({ label = 'Phone', value, onChange, error, required, className, labelClassName, containerClassName, placeholder = '(555) 123-4567' }: { label?: string; value?: string; onChange?: (val: string) => void; error?: string; required?: boolean; className?: string; labelClassName?: string; containerClassName?: string; placeholder?: string; }) => {
    const format = (raw: string) => {
        const digits = raw.replace(/\D/g, '').slice(0, 10);
        const parts = [] as string[];
        if (digits.length <= 3) return digits;
        parts.push('(' + digits.slice(0,3) + ')');
        if (digits.length <= 6) {
            parts.push(' ' + digits.slice(3));
            return parts.join('');
        }
        parts.push(' ' + digits.slice(3,6));
        parts.push('-' + digits.slice(6));
        return parts.join('');
    };
    return (
        <div className={cn('space-y-2', containerClassName)}>
            <label className={cn(labelStyles.base, labelStyles.states[error ? 'error' : 'default'], required && labelStyles.required, labelClassName)}>{label}</label>
            <input
                type="tel"
                inputMode="tel"
                className={cn(
                    baseInputStyles.base,
                    baseInputStyles.size,
                    baseInputStyles.focus,
                    baseInputStyles.disabled,
                    baseInputStyles.states[error ? 'error' : 'default'],
                    'tracking-wide',
                    className
                )}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(format(e.target.value))}
            />
            {error && (
                <div className="flex items-start gap-2 text-sm">
                    <AlertCircle size={16} className="text-red-500 mt-0.5" />
                    <span className="text-red-700 font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};