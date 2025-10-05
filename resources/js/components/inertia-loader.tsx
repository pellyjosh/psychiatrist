import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function InertiaLoader() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function onStart(event: any) {
            setVisible(true);
            setProgress(0);

            // Simulate progress
            let currentProgress = 0;
            const progressInterval = setInterval(() => {
                currentProgress += Math.random() * 15;
                if (currentProgress > 90) currentProgress = 90;
                setProgress(currentProgress);
            }, 100);

            // Store interval for cleanup
            (window as any).__loaderInterval = progressInterval;
        }

        function onFinish(event: any) {
            setProgress(100);

            // Clear progress interval
            if ((window as any).__loaderInterval) {
                clearInterval((window as any).__loaderInterval);
            }

            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        }

        document.addEventListener('inertia:start', onStart);
        document.addEventListener('inertia:finish', onFinish);
        document.addEventListener('inertia:error', onFinish);
        document.addEventListener('inertia:cancel', onFinish);

        return () => {
            document.removeEventListener('inertia:start', onStart);
            document.removeEventListener('inertia:finish', onFinish);
            document.removeEventListener('inertia:error', onFinish);
            document.removeEventListener('inertia:cancel', onFinish);

            if ((window as any).__loaderInterval) {
                clearInterval((window as any).__loaderInterval);
            }
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 h-2 w-full bg-emerald-100/30">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main loader */}
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="h-16 w-16 animate-pulse rounded-full border-4 border-emerald-200"></div>
                    <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-600"></div>
                    <Heart className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-emerald-600" />
                </div>
                <h2 className="mb-2 animate-pulse text-2xl font-semibold text-emerald-800">Psychiatry PLLC</h2>
                <p className="animate-fade-in-up text-emerald-600">Loading your mental health journey...</p>
                {progress > 0 && <div className="mt-2 text-xs text-emerald-500">{Math.round(progress)}%</div>}
            </div>
        </div>
    );
}
