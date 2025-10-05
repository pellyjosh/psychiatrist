import React from 'react';

export interface PasswordStrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  suggestions: string[];
}

export function evaluatePassword(pw: string): PasswordStrengthResult {
  if (!pw) return { score: 0, label: 'Empty', color: 'bg-gray-300', suggestions: ['Enter a password'] };
  let score = 0;
  const suggestions: string[] = [];
  if (pw.length >= 8) score++; else suggestions.push('Use at least 8 chars');
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++; else suggestions.push('Mix upper & lower');
  if (/\d/.test(pw)) score++; else suggestions.push('Add a number');
  if (/[^A-Za-z0-9]/.test(pw)) score++; else suggestions.push('Add a symbol');
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Robust'];
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500', 'bg-emerald-600'];
  return { score, label: labels[score], color: colors[score], suggestions };
}

export const PasswordStrengthBar: React.FC<{ password: string; touched?: boolean; }> = ({ password, touched }) => {
  const { score, label, color, suggestions } = evaluatePassword(password);
  const segments = 4; // evaluatePassword returns 0-4
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={segments} aria-label="Password strength">
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded ${i < score ? color : 'bg-gray-200'}`} />
        ))}
      </div>
      {touched && password && (
        <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
          <span>{label}</span>
          {score < 3 && suggestions[0] && <span className="truncate max-w-[160px]">{suggestions[0]}</span>}
        </div>
      )}
    </div>
  );
};
