/**
 * Validation utilities for Mind Express license IDs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate Mind Express License ID format (ME + 5 digits)
 */
export const validateLicenseId = (licenseId: string): ValidationResult => {
  if (!licenseId || licenseId.trim() === '') {
    return {
      isValid: false,
      error: 'License ID is required'
    };
  }

  const trimmedId = licenseId.trim().toUpperCase();
  const licensePattern = /^ME\d{5}$/;

  if (!licensePattern.test(trimmedId)) {
    return {
      isValid: false,
      error: 'Invalid format. Use ME followed by 5 digits (e.g., ME12345)'
    };
  }

  return { isValid: true };
};

/**
 * Format license ID to uppercase
 */
export const formatLicenseId = (licenseId: string): string => {
  return licenseId.trim().toUpperCase();
};

/**
 * Validate nickname (optional, max 20 characters)
 */
export const validateNickname = (nickname: string): ValidationResult => {
  if (!nickname || nickname.trim() === '') {
    return { isValid: true }; // Nickname is optional
  }

  if (nickname.length > 20) {
    return {
      isValid: false,
      error: 'Nickname must be 20 characters or less'
    };
  }

  return { isValid: true };
};
