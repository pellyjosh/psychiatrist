import { ImgHTMLAttributes } from 'react';

// Central brand icon using the provided PNG. (SVG version unused per request.)
export default function AppLogoIcon({ className = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.png"
            alt="Psychiatry PLLC Logo"
            className={`object-contain ${className}`}
            width={48}
            height={48}
            loading="lazy"
            decoding="async"
            {...rest}
        />
    );
}
