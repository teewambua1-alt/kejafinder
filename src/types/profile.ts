export type UserRole = "renter" | "landlord" | "caretaker" | "agent" | "scout" | "admin";

export interface ProfileUser {
  id: string;
  fullName: string;
  role: UserRole;
  phone: string;
  email?: string;
  location?: string;
  profilePhoto?: string;
  isPhoneVerified: boolean;
  isLocationChecked: boolean;
  isScoutVerified: boolean;
  joinedAt?: string;
}
