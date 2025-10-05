import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface FlashBag {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export function FlashMessages() {
    const { props } = usePage<{ flash: FlashBag }>();
    const flash = props.flash || {};
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (flash.success || flash.error || flash.warning || flash.info) {
            setVisible(true);
            const t = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(t);
        }
    }, [flash.success, flash.error, flash.warning, flash.info]);

    if (!visible) return null;
    const type = flash.success ? 'success' : flash.error ? 'error' : flash.warning ? 'warning' : flash.info ? 'info' : null;
    const message = flash.success || flash.error || flash.warning || flash.info;
    if (!type || !message) return null;

    const styles: Record<string, string> = {
        success: 'bg-teal-600 border-teal-700',
        error: 'bg-red-600 border-red-700',
        warning: 'bg-yellow-500 border-yellow-600',
        info: 'bg-blue-600 border-blue-700',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-md border px-4 py-3 text-white shadow-lg ${styles[type]}`}>
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm leading-snug font-medium">{message}</p>
                <button aria-label="Dismiss" onClick={() => setVisible(false)} className="text-white/80 hover:text-white">
                    ×
                </button>
            </div>
        </div>
    );
}
