import { CSSProperties } from 'react';
import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    /** Pixel size of the square logo container */
    size?: number;
    /** Override brand text (defaults to Psychiatry PLLC) */
    text?: string;
    /** Hide brand text entirely */
    hideText?: boolean;
    /** Additional classes for outer wrapper */
    className?: string;
    /** Additional classes for text span */
    textClassName?: string;
    /** If true, use a visually minimal background (no colored square) */
    minimal?: boolean;
    /** Single Tailwind color class applied to text (no dark mode branching). */
    textColor?: string; // e.g. 'text-emerald-700'
}

export default function AppLogo({
    size = 32,
    text = 'Psychiatry PLLC',
    hideText = false,
    className = '',
    textClassName = '',
    minimal = false,
    textColor,
}: AppLogoProps) {
    const iconSize = Math.round(size * 0.75);

    const containerStyle: CSSProperties = {
        width: size,
        height: size,
    };

    const appliedTextColor = textColor || 'text-slate-900';

    return (
        <div className={`flex items-center select-none ${className}`}>
            {/* <div
                style={containerStyle}
                className={
                    `${minimal ? '' : 'rounded-md bg-sidebar-primary text-sidebar-primary-foreground'} ` +
                    'flex flex-shrink-0 items-center justify-center'
                }
            > */}
                <AppLogoIcon style={{ width: iconSize, height: iconSize }} className="object-contain" aria-hidden="true" />
            {/* </div> */}
            {!hideText && <span className={`ml-2 leading-tight font-semibold tracking-tight ${appliedTextColor} ${textClassName}`}>{text}</span>}
        </div>
    );
}
