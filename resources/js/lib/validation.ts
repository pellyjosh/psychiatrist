// Shared client-side validation helpers for auth forms
// Each validator returns an error string or undefined if valid

export function validateEmail(value: string): string | undefined {
    if (!value) return 'Email is required';
    // Basic robust-ish pattern (still let backend be source of truth)
    const re = /^(?:[a-zA-Z0-9_'^&+%`{}~!-]+(?:\.[a-zA-Z0-9_'^&+%`{}~!-]+)*|".+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    if (!re.test(value)) return 'Enter a valid email address';
}

export function validateName(value: string): string | undefined {
    if (!value) return 'Name is required';
    if (value.trim().length < 2) return 'Name is too short';
}

export function validatePassword(value: string): string | undefined {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Use at least 8 characters';
    // Encourage complexity (not strictly required)
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    const checks = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
    if (checks < 2) return 'Add a mix of upper/lowercase, numbers or symbols';
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | undefined {
    if (!confirmation) return 'Please confirm password';
    if (password !== confirmation) return 'Passwords do not match';
}

export function fieldSuccessMessage(field: string): string {
    switch (field) {
        case 'email': return 'Email looks good';
        case 'name': return 'Name looks good';
        case 'password': return 'Strong enough';
        case 'password_confirmation': return 'Passwords match';
        default: return 'Looks good';
    }
}
