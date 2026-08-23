import { AuthError } from '@supabase/supabase-js';

/**
 * Codes Supabase actually returns, mapped to something a renter can act on.
 *
 * `over_email_send_rate_limit` is the one worth understanding: it is not the
 * user sending too many requests, it is the *project* exhausting its email
 * quota. Supabase's built-in SMTP allows only a couple of confirmation emails
 * per hour on a free project, so once that is spent every signup fails --
 * which reads as "creating an account is broken". The previous wording,
 * "Please wait a moment", understated it by about an hour and implied the user
 * had done something wrong.
 */
const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect email or password.',
  email_not_confirmed: 'Confirm your email first. Check your inbox for the link we sent.',
  user_already_exists: 'An account with this email already exists. Try logging in instead.',
  weak_password: 'Choose a stronger password (at least 6 characters).',
  // Supabase rejects addresses at domains that cannot receive mail, including
  // example.com and anything under .test -- so this fires on typos too.
  email_address_invalid: 'That email address was rejected. Check the spelling of the part after the @.',
  validation_failed: 'Check the details you entered and try again.',
  over_email_send_rate_limit:
    'We could not send the confirmation email right now — our email limit is full. Try again in about an hour, or ask support to finish setting up your account.',
  over_request_rate_limit: 'Too many attempts. Wait a minute and try again.',
  signup_disabled: 'New accounts are turned off at the moment.',
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
