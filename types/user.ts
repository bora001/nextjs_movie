export interface UserType {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  emailVerified: boolean;
  createdAt: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpiry?: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
  token?: string;
}

export interface TokenType {
  token: string;
  email: string;
  expiresAt: Date;
}

export interface VerifiedEmailType {
  email: string;
  verifiedAt: Date;
}

export interface pendingRegisterType {
  email: string;
  name: string;
  password: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface emailVerificationCodeType {
  email: string;
  code: string;
  expiresAt: Date;
}
