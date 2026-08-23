/**
 * 'otp' was removed: nothing ever navigated to that step, and the component
 * behind it checked a hardcoded "123456" with no Supabase OTP call anywhere in
 * the codebase. 'trust' is now where the account is actually created, so the
 * order reads welcome -> signup -> role -> trust.
 */
// "confirm" is a real destination, not a toast: with email confirmation on,
// signUp() returns no session, so the account exists but cannot be used yet.
// That state needs a screen you can act from -- resend, or go and log in.
export type AuthMode = "welcome" | "login" | "signup" | "role" | "trust" | "confirm";

export type AuthRole =
  | "tenant"
  | "landlord"
  | "caretaker"
  | "agent"
  | "scout";

/**
 * Draft profile collected across the sign-up steps.
 *
 * Deliberately has no `password` field. It used to, which meant the plaintext
 * password was held in a shared object that got spread between steps and was
 * never cleared. The password now lives in a dedicated ref in AuthPage that is
 * wiped as soon as the account is created (and on unmount).
 */
export type AuthDraftUser = {
  fullName?: string;
  phone?: string;
  email?: string;
  mainArea?: string;
  role?: AuthRole;
};
