import React, { createContext, useCallback, useContext, useState } from 'react';

export type Toast = {
    id: string;
    title?: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
};

type ToastProviderState = {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
};

const ToastProviderContext = createContext<ToastProviderState | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: Toast = { id, ...toast };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove toast after duration (default 5 seconds)
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastProviderContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
            {children}
            <ToastContainer />
        </ToastProviderContext.Provider>
    );
}

function ToastContainer() {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="pointer-events-none fixed right-0 bottom-0 z-50 w-full max-w-md space-y-4 p-4">
            {toasts.map((toast) => (
                <div key={toast.id} className={`pointer-events-auto rounded-xl border p-4 shadow-xl backdrop-blur-sm ${getToastStyles(toast.type)}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {toast.title && <h4 className="mb-1 text-sm font-semibold">{toast.title}</h4>}
                            <p className="text-sm">{toast.message}</p>
                            {toast.action && (
                                <button
                                    onClick={toast.action.onClick}
                                    className="mt-3 rounded-lg bg-white/20 px-3 py-1 text-xs font-medium transition-colors hover:bg-white/30"
                                >
                                    {toast.action.label}
                                </button>
                            )}
                        </div>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 text-current opacity-60 transition-opacity hover:opacity-100">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getToastStyles(type: Toast['type']): string {
    switch (type) {
        case 'success':
            return 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 shadow-lg shadow-green-100/50';
        case 'error':
            return 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300 shadow-lg shadow-red-100/50';
        case 'warning':
            return 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-300 shadow-lg shadow-amber-100/50';
        case 'info':
        default:
            return 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300 shadow-lg shadow-emerald-100/50';
    }
}

export const useToast = () => {
    const context = useContext(ToastProviderContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
