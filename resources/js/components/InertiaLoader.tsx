import { useEffect, useRef, useState } from 'react';

export default function InertiaLoader() {
    const [visible, setVisible] = useState(false);
    const showTimer = useRef<number | null>(null);
    const safetyTimer = useRef<number | null>(null);
    const navCount = useRef(0);

    useEffect(() => {
        function clearShowTimer() {
            if (showTimer.current) { window.clearTimeout(showTimer.current); showTimer.current = null; }
        }

        function clearSafetyTimer() {
            if (safetyTimer.current) { window.clearTimeout(safetyTimer.current); safetyTimer.current = null; }
        }

        function startSafetyTimer() {
            // auto-hide after 10s to avoid stuck overlay
            clearSafetyTimer();
            safetyTimer.current = window.setTimeout(() => {
                navCount.current = 0;
                clearShowTimer();
                setVisible(false);
            }, 10000);
        }

        function onStart() {
            navCount.current += 1;
            // small delay to avoid flicker on very fast navigations
            if (showTimer.current) window.clearTimeout(showTimer.current);
            showTimer.current = window.setTimeout(() => {
                if (navCount.current > 0) setVisible(true);
            }, 120);
            startSafetyTimer();
        }

        function onFinish() {
            navCount.current = Math.max(0, navCount.current - 1);
            if (navCount.current === 0) {
                clearShowTimer();
                clearSafetyTimer();
                setVisible(false);
            }
        }

        // Inertia dispatches DOM events on document: 'inertia:start', 'inertia:finish', 'inertia:error', 'inertia:cancel'
        document.addEventListener('inertia:start', onStart as EventListener);
        document.addEventListener('inertia:finish', onFinish as EventListener);
        document.addEventListener('inertia:error', onFinish as EventListener);
        document.addEventListener('inertia:cancel', onFinish as EventListener);

        return () => {
            document.removeEventListener('inertia:start', onStart as EventListener);
            document.removeEventListener('inertia:finish', onFinish as EventListener);
            document.removeEventListener('inertia:error', onFinish as EventListener);
            document.removeEventListener('inertia:cancel', onFinish as EventListener);
            clearShowTimer();
            clearSafetyTimer();
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
                <svg className="h-12 w-12 animate-spin text-neutral-800 dark:text-neutral-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <div className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Loading…</div>
            </div>
        </div>
    );
}
