<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}</title>

    <!-- Primary Meta Tags -->
    <meta name="title" content="{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}">
    <meta name="description"
        content="Dr. Lola Akinola, DNP, PMHNP-BC - {{ getYearsOfExperienceFormatted() }} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management. Telehealth available.">
    <meta name="keywords"
        content="psychiatrist, mental health, ADHD, anxiety, depression, PTSD, telehealth, psychiatric nurse practitioner, Dr. Akinola">
    <meta name="author" content="Dr. Omolola Akinola">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:title" content="{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}">
    <meta property="og:description"
        content="Dr. Lola Akinola, DNP, PMHNP-BC - {{ getYearsOfExperienceFormatted() }} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management.">
    <meta property="og:image" content="{{ asset('logo.png') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ config('app.url') }}">
    <meta property="twitter:title" content="{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}">
    <meta property="twitter:description"
        content="Dr. Lola Akinola, DNP, PMHNP-BC - {{ getYearsOfExperienceFormatted() }} experience in psychiatric mental health care. Specializing in ADHD, anxiety, depression, PTSD, and medication management.">
    <meta property="twitter:image" content="{{ asset('logo.png') }}">

    <!-- Additional Meta Tags -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta name="theme-color" content="#00b578">
    <meta name="msapplication-TileColor" content="#00b578">
    <meta name="application-name" content="{{ config('app.name', 'Omolola Akinola Psychiatry PLLC') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ config('app.url') }}">

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
