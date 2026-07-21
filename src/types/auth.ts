export type AuthMode = "welcome" | "login" | "signup" | "role" | "otp" | "trust";

export type AuthRole =
  | "tenant"
  | "landlord"
  | "caretaker"
  | "agent"
  | "scout";

export type AuthDraftUser = {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  mainArea?: string;
  role?: AuthRole;
};
