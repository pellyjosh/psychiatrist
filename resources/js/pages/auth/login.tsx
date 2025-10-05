import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormInput } from '@/components/ui/form-inputs';
import AuthLayout from '@/layouts/auth-layout';
import { fieldSuccessMessage, validateEmail, validatePassword } from '@/lib/validation';
import { request } from '@/routes/password';
import { Form, Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    // We'll mirror basic form values locally for live validation hints
    const inertiaForm = AuthenticatedSessionController.store.form();
    const { data, setData } = useForm({ email: '', password: '', remember: false });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});

    const runValidation = useCallback((field: string, value: string) => {
        let err: string | undefined;
        if (field === 'email') err = validateEmail(value);
        if (field === 'password') err = validatePassword(value);
        setClientErrors((prev) => ({ ...prev, [field]: err }));
        return err;
    }, []);

    useEffect(() => {
        if (touched.email) runValidation('email', data.email);
    }, [data.email, touched.email, runValidation]);

    useEffect(() => {
        if (touched.password) runValidation('password', data.password);
    }, [data.password, touched.password, runValidation]);

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        runValidation(field, (data as any)[field]);
    };

    const serverErrors = (errors: Record<string, string>) => errors;

    const mergedError = (errors: Record<string, string>, field: string): string | undefined => {
        // Prefer server error if present
        if (errors[field]) return errors[field];
        return clientErrors[field];
    };

    const successFor = (errors: Record<string, string>, field: string): string | undefined => {
        if (!touched[field]) return undefined;
        const err = mergedError(errors, field);
        if (!err && (data as any)[field]) return fieldSuccessMessage(field);
        return undefined;
    };

    return (
        <AuthLayout title="Welcome Back" description="Enter your credentials to access your account and manage your appointments">
            <Head title="Log in" />
            {status && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700" role="status">
                    {status}
                </div>
            )}
            <Form {...inertiaForm} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <FormInput
                                label="Email address"
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                autoComplete="email"
                                autoFocus
                                placeholder="you@example.com"
                                error={mergedError(errors, 'email')}
                                success={successFor(errors, 'email')}
                                hint={!touched.email ? 'Use your registered email' : undefined}
                            />

                            <div>
                                <div className="mb-2 flex items-center">
                                    <span className="sr-only" id="password-label">
                                        Password field
                                    </span>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm text-green-600 hover:text-green-700" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <FormInput
                                    label="Password"
                                    type="password"
                                    required
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    error={mergedError(errors, 'password')}
                                    success={successFor(errors, 'password')}
                                    hint={!touched.password ? 'At least 8 chars & mix of types' : undefined}
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={!!data.remember}
                                    onCheckedChange={(checked) => setData('remember', !!checked)}
                                    tabIndex={3}
                                    className="border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <label htmlFor="remember" className="cursor-pointer text-sm text-gray-600 select-none">
                                    Remember me
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full bg-gradient-to-r from-green-600 to-green-700 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                        {/* <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={6} className="font-medium text-green-600 hover:text-green-700 hover:underline">
                                Create one here
                            </TextLink>
                        </div> */}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
