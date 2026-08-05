import { AuthError } from '@supabase/supabase-js';

const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect email or password.',
  user_already_exists: 'An account with this email already exists. Try logging in instead.',
  weak_password: 'Choose a stronger password (at least 6 characters).',
  email_address_invalid: 'Enter a valid email address.',
  over_email_send_rate_limit: 'Too many attempts. Please wait a moment and try again.',
};

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.code && MESSAGES[error.code]) {
      return MESSAGES[error.code];
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
