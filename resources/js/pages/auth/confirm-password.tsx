import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-inputs';
import AuthLayout from '@/layouts/auth-layout';
import { fieldSuccessMessage, validatePassword } from '@/lib/validation';
import { Form, Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function ConfirmPassword() {
    const inertiaForm = ConfirmablePasswordController.store.form();
    const { data, setData } = useForm({ password: '' });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
    const runValidation = useCallback((value: string) => {
        const err = validatePassword(value);
        setClientErrors({ password: err });
        return err;
    }, []);
    useEffect(() => {
        if (touched.password) runValidation(data.password);
    }, [data.password, touched.password, runValidation]);
    const handleBlur = () => {
        setTouched({ password: true });
        runValidation(data.password);
    };
    const mergedError = (errors: Record<string, string>) => errors.password || clientErrors.password;
    const success = (errors: Record<string, string>) => {
        if (!touched.password) return undefined;
        const err = mergedError(errors);
        if (!err && data.password) return fieldSuccessMessage('password');
        return undefined;
    };
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />
            <Form {...inertiaForm} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <FormInput
                            label="Password"
                            name="password"
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onBlur={handleBlur}
                            placeholder="Password"
                            autoComplete="current-password"
                            autoFocus
                            error={mergedError(errors)}
                            success={success(errors)}
                            hint={!touched.password ? 'Confirm for security' : undefined}
                        />
                        <div className="flex items-center">
                            <Button className="w-full" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm password
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
