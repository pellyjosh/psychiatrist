/**
 * License and experience calculation utilities
 */

// License issue date - this will be used to calculate years of experience
// You can update this date when needed
export const LICENSE_ISSUE_DATE = new Date('2008-01-15'); // License issued January 15, 2020

// Updated contact information
export const CONTACT_PHONE = '3474503015';
export const CONTACT_PHONE_FORMATTED = '(347) 450-3015';

/**
 * Calculate years of experience from license issue date
 * @returns Current years of experience as a number
 */
export function getYearsOfExperience(): number {
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - LICENSE_ISSUE_DATE.getTime();
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years
    return Math.floor(diffInYears);
}

/**
 * Get formatted years of experience string
 * @returns Formatted string like "17+ years" (dynamically calculated)
 */
export function getYearsOfExperienceFormatted(): string {
    const years = getYearsOfExperience();
    return `${years}+ years`;
}

/**
 * Get the license issue date
 * @returns License issue date
 */
export function getLicenseIssueDate(): Date {
    return LICENSE_ISSUE_DATE;
}

/**
 * Format license issue date for display
 * @returns Formatted date string
 */
export function getLicenseIssueDateFormatted(): string {
    return LICENSE_ISSUE_DATE.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}