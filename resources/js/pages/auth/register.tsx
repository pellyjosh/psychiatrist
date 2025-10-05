import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-inputs';
import { PasswordStrengthBar } from '@/components/ui/password-strength';
import AuthLayout from '@/layouts/auth-layout';
import { fieldSuccessMessage, validateEmail, validateName, validatePassword, validatePasswordConfirmation } from '@/lib/validation';
import { login } from '@/routes';
import { Form, Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function Register() {
    const inertiaForm = RegisteredUserController.store.form();
    const { data, setData } = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});

    const runValidation = useCallback(
        (field: string, value: string) => {
            let err: string | undefined;
            if (field === 'name') err = validateName(value);
            if (field === 'email') err = validateEmail(value);
            if (field === 'password') err = validatePassword(value);
            if (field === 'password_confirmation') err = validatePasswordConfirmation(data.password, value);
            setClientErrors((prev) => ({ ...prev, [field]: err }));
            return err;
        },
        [data.password],
    );

    useEffect(() => {
        if (touched.name) runValidation('name', data.name);
    }, [data.name, touched.name, runValidation]);
    useEffect(() => {
        if (touched.email) runValidation('email', data.email);
    }, [data.email, touched.email, runValidation]);
    useEffect(() => {
        if (touched.password) runValidation('password', data.password);
    }, [data.password, touched.password, runValidation]);
    useEffect(() => {
        if (touched.password_confirmation) runValidation('password_confirmation', data.password_confirmation);
    }, [data.password_confirmation, touched.password_confirmation, runValidation]);

    const handleBlur = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
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
        <AuthLayout title="Create Your Account" description="Join our practice to book appointments and manage your mental health journey">
            <Head title="Register" />
            <Form {...inertiaForm} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <FormInput
                                label="Full Name"
                                name="name"
                                id="name"
                                required
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                autoComplete="name"
                                placeholder="Enter your full name"
                                error={mergedError(errors, 'name')}
                                success={successFor(errors, 'name')}
                                hint={!touched.name ? 'First and last helps us personalize' : undefined}
                            />
                            <FormInput
                                label="Email Address"
                                name="email"
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                autoComplete="email"
                                placeholder="you@example.com"
                                error={mergedError(errors, 'email')}
                                success={successFor(errors, 'email')}
                                hint={!touched.email ? 'We will send confirmations here' : undefined}
                            />
                            <div>
                                <FormInput
                                    label="Password"
                                    name="password"
                                    id="password"
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    autoComplete="new-password"
                                    placeholder="Choose a strong password"
                                    error={mergedError(errors, 'password')}
                                    success={successFor(errors, 'password')}
                                    hint={!touched.password ? '8+ chars, mix cases, numbers or symbols' : undefined}
                                />
                                <PasswordStrengthBar password={data.password} touched={touched.password} />
                            </div>
                            <FormInput
                                label="Confirm Password"
                                name="password_confirmation"
                                id="password_confirmation"
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                onBlur={() => handleBlur('password_confirmation')}
                                autoComplete="new-password"
                                placeholder="Confirm your password"
                                error={mergedError(errors, 'password_confirmation')}
                                success={successFor(errors, 'password_confirmation')}
                                hint={!touched.password_confirmation ? 'Repeat password to confirm' : undefined}
                            />
                            <Button
                                type="submit"
                                className="mt-2 h-12 w-full bg-gradient-to-r from-green-600 to-green-700 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                {processing ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6} className="font-medium text-green-600 hover:text-green-700 hover:underline">
                                Sign in here
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
