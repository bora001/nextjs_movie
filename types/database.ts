import { LikedMovieType } from "./movie";
import {
  emailVerificationCodeType,
  pendingRegisterType,
  TokenType,
  UserType,
  VerifiedEmailType,
} from "./user";

export type DataBaseType = {
  likedMovies: LikedMovieType;
  users: UserType;
  emailVerificationTokens: TokenType;
  verifiedEmails: VerifiedEmailType;
  pendingRegistrations: pendingRegisterType;
  emailVerificationCodes: emailVerificationCodeType;
};
