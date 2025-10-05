import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-inputs';
import { PasswordStrengthBar } from '@/components/ui/password-strength';
import AuthLayout from '@/layouts/auth-layout';
import { fieldSuccessMessage, validatePassword, validatePasswordConfirmation } from '@/lib/validation';
import { Form, Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const inertiaForm = NewPasswordController.store.form();
    const { data, setData } = useForm({ password: '', password_confirmation: '' });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
    const runValidation = useCallback(
        (field: string, value: string) => {
            let err: string | undefined;
            if (field === 'password') err = validatePassword(value);
            if (field === 'password_confirmation') err = validatePasswordConfirmation(data.password, value);
            setClientErrors((p) => ({ ...p, [field]: err }));
            return err;
        },
        [data.password],
    );
    useEffect(() => {
        if (touched.password) runValidation('password', data.password);
    }, [data.password, touched.password, runValidation]);
    useEffect(() => {
        if (touched.password_confirmation) runValidation('password_confirmation', data.password_confirmation);
    }, [data.password_confirmation, touched.password_confirmation, runValidation]);
    const handleBlur = (field: string) => {
        setTouched((t) => ({ ...t, [field]: true }));
        runValidation(field, (data as any)[field]);
    };
    const mergedError = (errors: Record<string, string>, field: string) => errors[field] || clientErrors[field];
    const successFor = (errors: Record<string, string>, field: string) => {
        if (!touched[field]) return undefined;
        const err = mergedError(errors, field);
        if (!err && (data as any)[field]) return fieldSuccessMessage(field);
        return undefined;
    };
    return (
        <AuthLayout title="Reset password" description="Please enter your new password below">
            <Head title="Reset password" />
            <Form {...inertiaForm} transform={(formData) => ({ ...formData, token, email })} resetOnSuccess={['password', 'password_confirmation']}>
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <FormInput
                            label="Email"
                            name="email"
                            id="email"
                            type="email"
                            value={email}
                            readOnly
                            disabled
                            hint="Email is fixed for this reset"
                        />
                        <div>
                            <FormInput
                                label="Password"
                                name="password"
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onBlur={() => handleBlur('password')}
                                autoFocus
                                autoComplete="new-password"
                                placeholder="New password"
                                error={mergedError(errors, 'password')}
                                success={successFor(errors, 'password')}
                                hint={!touched.password ? '8+ chars, mix of character types' : undefined}
                            />
                            <PasswordStrengthBar password={data.password} touched={touched.password} />
                        </div>
                        <FormInput
                            label="Confirm password"
                            name="password_confirmation"
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            onBlur={() => handleBlur('password_confirmation')}
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            error={mergedError(errors, 'password_confirmation')}
                            success={successFor(errors, 'password_confirmation')}
                            hint={!touched.password_confirmation ? 'Repeat password to confirm' : undefined}
                        />
                        <Button type="submit" className="mt-2 w-full" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Reset password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
