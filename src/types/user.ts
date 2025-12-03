/**
 * User entity interface
 */
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * User roles enum
 */
export type UserRole = "admin" | "user" | "moderator";

/**
 * User status enum
 */
export type UserStatus = "active" | "inactive" | "banned";

/**
 * User profile (subset of User for display)
 */
export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  email: string;
}

