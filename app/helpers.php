<?php

if (!function_exists('getLicenseIssueDate')) {
    /**
     * Get the license issue date
     */
    function getLicenseIssueDate(): DateTime
    {
        // License issue date - update this when needed
        return new DateTime('2008-01-15');
    }
}

if (!function_exists('getYearsOfExperience')) {
    /**
     * Calculate years of experience from license issue date
     */
    function getYearsOfExperience(): int
    {
        $licenseDate = getLicenseIssueDate();
        $currentDate = new DateTime();
        $interval = $licenseDate->diff($currentDate);
        return $interval->y;
    }
}

if (!function_exists('getYearsOfExperienceFormatted')) {
    /**
     * Get formatted years of experience string
     */
    function getYearsOfExperienceFormatted(): string
    {
        $years = getYearsOfExperience();
        return $years . '+ years';
    }
}

if (!function_exists('getContactPhone')) {
    /**
     * Get the current contact phone number
     */
    function getContactPhone(): string
    {
        return '3474503015';
    }
}

if (!function_exists('getContactPhoneFormatted')) {
    /**
     * Get the formatted contact phone number
     */
    function getContactPhoneFormatted(): string
    {
        return '(347) 450-3015';
    }
}