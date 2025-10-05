import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { InertiaLoader } from './components/inertia-loader';
import { ThemeProvider } from './components/theme-provider';
import { ToastProvider } from './components/toast-provider';
import { initializeTheme } from './hooks/use-appearance';

const queryClient = new QueryClient();

const appName = import.meta.env.VITE_APP_NAME || 'Omolola Akinola, DNP, PMHNP-BC';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <ToastProvider>
                        <App {...props} />
                        {/* <InertiaLoader /> */}
                    </ToastProvider>
                </ThemeProvider>
            </QueryClientProvider>,
        );
    },
    progress: false, // Disable default progress bar since we have our own
});

// This will set light / dark mode on load...
initializeTheme();
