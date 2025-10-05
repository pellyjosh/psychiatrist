// Components
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-inputs';
import AuthLayout from '@/layouts/auth-layout';
import { fieldSuccessMessage, validateEmail } from '@/lib/validation';
import { login } from '@/routes';
import { Form, Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const inertiaForm = PasswordResetLinkController.store.form();
    const { data, setData } = useForm({ email: '' });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
    const runValidation = useCallback((field: string, value: string) => {
        let err: string | undefined;
        if (field === 'email') err = validateEmail(value);
        setClientErrors((prev) => ({ ...prev, [field]: err }));
        return err;
    }, []);
    useEffect(() => {
        if (touched.email) runValidation('email', data.email);
    }, [data.email, touched.email, runValidation]);
    const handleBlur = () => {
        setTouched({ email: true });
        runValidation('email', data.email);
    };
    const mergedError = (errors: Record<string, string>, field: string) => errors[field] || clientErrors[field];
    const successFor = (errors: Record<string, string>, field: string) => {
        if (!touched[field]) return undefined;
        const err = mergedError(errors, field);
        if (!err && (data as any)[field]) return fieldSuccessMessage(field);
        return undefined;
    };
    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive a password reset link">
            <Head title="Forgot password" />
            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600" role="status">
                    {status}
                </div>
            )}
            <div className="space-y-6">
                <Form {...inertiaForm}>
                    {({ processing, errors }) => (
                        <>
                            <FormInput
                                label="Email address"
                                name="email"
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={handleBlur}
                                autoFocus
                                placeholder="email@example.com"
                                error={mergedError(errors, 'email')}
                                success={successFor(errors, 'email')}
                                hint={!touched.email ? 'Enter the email you registered with' : undefined}
                            />
                            <div className="my-6 flex items-center justify-start">
                                <Button className="w-full" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Email password reset link
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Or, return to</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
