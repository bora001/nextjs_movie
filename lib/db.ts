import { MongoClient, Db } from "mongodb";
import { UserType } from "@/types/user";
import { LikeType } from "@/types/movie";
import dotenv from "dotenv";
import { DataBaseType } from "@/types/database";

dotenv.config();

let client: MongoClient | null = null;
let db: Db | null = null;

// connect to MongoDB
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }

  db = client.db();

  // create email index to prevent duplicate email
  const usersCollection = db.collection<UserType>("users");
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  return db;
}

// connect and get Database
export async function connectCollection<K extends keyof DataBaseType>(
  collectionName: K
) {
  try {
    const database = await connectToDatabase();
    return database.collection<DataBaseType[K]>(collectionName);
  } catch (error) {
    console.error(`Error getting ${String(collectionName)} collection:`, error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserType | null> {
  try {
    const userCollection = await connectCollection("users");
    // const collection = await getUsersCollection();
    const user = await userCollection.findOne(
      { id: userId },
      { projection: { _id: 0, password: 0 } } // _id, password remove
    );
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserType | null> {
  try {
    const userCollection = await connectCollection("users");
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Create user
export async function createUser(user: UserType): Promise<boolean> {
  try {
    const userCollection = await connectCollection("users");

    // Check if email already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      return false;
    }

    // Insert user
    await userCollection.insertOne(user);
    return true;
  } catch (error) {
    console.error("Error creating user:", error);

    // handle MongoDB unique index error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return false;
    }
    return false;
  }
}

// Update user
export async function updateUser(
  userId: string,
  updates: Partial<UserType>
): Promise<boolean> {
  try {
    const userCollection = await connectCollection("users");
    const result = await userCollection.updateOne(
      { id: userId },
      { $set: updates }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}

// Delete user and all associated data
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const userCollection = await connectCollection("users");
    const likedMoviesCollection = await connectCollection("likedMovies");

    // Delete all liked movies for this user
    await likedMoviesCollection.deleteMany({ userId });

    // Delete the user
    const result = await userCollection.deleteOne({ id: userId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

// store email verification token to separate collection
export async function storeEmailVerificationToken(
  email: string,
  token: string,
  expiryMinutes: number = 60
): Promise<boolean> {
  try {
    const tokensCollection = await connectCollection("emailVerificationTokens");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    await tokensCollection.insertOne({
      token,
      email: email.toLowerCase(),
      expiresAt,
    });

    // create TTL index to automatically delete expired tokens
    try {
      await tokensCollection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
    } catch (error) {
      // ignore if index already exists
    }

    return true;
  } catch (error) {
    console.error("Error storing email verification token:", error);
    return false;
  }
}

// Get email from verification token
export async function getEmailFromVerificationToken(
  token: string
): Promise<string | null> {
  try {
    const tokensCollection = await connectCollection("emailVerificationTokens");

    const tokenDoc = await tokensCollection.findOne({ token });
    if (!tokenDoc) {
      return null;
    }

    // check if token is expired
    if (tokenDoc.expiresAt < new Date()) {
      await tokensCollection.deleteOne({ token });
      return null;
    }

    return tokenDoc.email;
  } catch (error) {
    console.error("Error getting email from token:", error);
    return null;
  }
}

// Delete email verification token
export async function deleteEmailVerificationToken(
  token: string
): Promise<boolean> {
  try {
    const tokensCollection = await connectCollection("emailVerificationTokens");
    const result = await tokensCollection.deleteOne({ token });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting verification token:", error);
    return false;
  }
}

// Store verified email (for pre-registration verification)
export async function storeVerifiedEmail(email: string): Promise<boolean> {
  try {
    const verifiedEmailsCollection = await connectCollection("verifiedEmails");
    // const database = await connectToDatabase();
    // const verifiedEmailsCollection = database.collection<{
    //   email: string;
    //   verifiedAt: Date;
    // }>("verifiedEmails");

    // Check if already verified
    const existing = await verifiedEmailsCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      // Update verifiedAt
      await verifiedEmailsCollection.updateOne(
        { email: email.toLowerCase() },
        { $set: { verifiedAt: new Date() } }
      );
    } else {
      // Insert new verified email
      await verifiedEmailsCollection.insertOne({
        email: email.toLowerCase(),
        verifiedAt: new Date(),
      });
    }

    return true;
  } catch (error) {
    console.error("Error storing verified email:", error);
    return false;
  }
}

// Check if email is verified (for pre-registration verification)
export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const verifiedEmailsCollection = await connectCollection("verifiedEmails");

    const verified = await verifiedEmailsCollection.findOne({
      email: email.toLowerCase(),
    });

    return verified !== null;
  } catch (error) {
    console.error("Error checking verified email:", error);
    return false;
  }
}

// Store pending registration (temporary user data before email verification)
export async function storePendingRegistration(
  email: string,
  name: string,
  hashedPassword: string,
  token: string
): Promise<boolean> {
  try {
    const pendingRegistrationsCollection = await connectCollection(
      "pendingRegistrations"
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    await pendingRegistrationsCollection.insertOne({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      token,
      createdAt: new Date(),
      expiresAt,
    });

    // create TTL index to automatically delete expired registrations
    try {
      await pendingRegistrationsCollection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
    } catch (error) {
      // ignore if index already exists
    }

    return true;
  } catch (error) {
    console.error("Error storing pending registration:", error);
    return false;
  }
}

// Get pending registration by token
export async function getPendingRegistrationByToken(
  token: string
): Promise<{ email: string; name: string; password: string } | null> {
  try {
    const pendingRegistrationsCollection = await connectCollection(
      "pendingRegistrations"
    );

    const pending = await pendingRegistrationsCollection.findOne({ token });
    if (!pending) {
      return null;
    }

    // check if expired
    if (pending.expiresAt < new Date()) {
      await pendingRegistrationsCollection.deleteOne({ token });
      return null;
    }

    return {
      email: pending.email,
      name: pending.name,
      password: pending.password,
    };
  } catch (error) {
    console.error("Error getting pending registration:", error);
    return null;
  }
}

// Delete pending registration
export async function deletePendingRegistration(
  token: string
): Promise<boolean> {
  try {
    const pendingRegistrationsCollection = await connectCollection(
      "pendingRegistrations"
    );

    const result = await pendingRegistrationsCollection.deleteOne({ token });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting pending registration:", error);
    return false;
  }
}

// Store email verification code
export async function storeEmailVerificationCode(
  email: string,
  code: string,
  expiryMinutes: number = 10
): Promise<boolean> {
  try {
    const codesCollection = await connectCollection("emailVerificationCodes");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    // Delete existing code for this email
    await codesCollection.deleteMany({ email: email.toLowerCase() });

    // Insert new code
    await codesCollection.insertOne({
      email: email.toLowerCase(),
      code,
      expiresAt,
    });

    // create TTL index to automatically delete expired codes
    try {
      await codesCollection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
    } catch (error) {
      // ignore if index already exists
    }

    return true;
  } catch (error) {
    console.error("Error storing email verification code:", error);
    return false;
  }
}

// Verify email verification code
export async function verifyEmailVerificationCode(
  email: string,
  code: string
): Promise<boolean> {
  try {
    const codesCollection = await connectCollection("emailVerificationCodes");

    const codeDoc = await codesCollection.findOne({
      email: email.toLowerCase(),
      code,
    });

    if (!codeDoc) {
      return false;
    }

    // check if code is expired
    if (codeDoc.expiresAt < new Date()) {
      await codesCollection.deleteOne({ email: email.toLowerCase(), code });
      return false;
    }

    // Delete code after successful verification
    await codesCollection.deleteOne({ email: email.toLowerCase(), code });
    return true;
  } catch (error) {
    console.error("Error verifying email verification code:", error);
    return false;
  }
}

// Get like status for a movie (server-side)
export async function getMovieLikeStatus(
  movieId: number,
  userId: string | null
): Promise<LikeType> {
  try {
    const likedMoviesCollection = await connectCollection("likedMovies");

    // Get like count (public information)
    const likeCount = await likedMoviesCollection.countDocuments({
      movieId: Number(movieId),
    });

    // Check if user liked this movie (only if user is logged in)
    let liked = false;
    if (userId) {
      const existingLike = await likedMoviesCollection.findOne({
        userId: userId,
        movieId: Number(movieId),
      });
      liked = !!existingLike;
    }

    return { liked, likeCount };
  } catch (error) {
    console.error("Error getting movie like status:", error);
    return { liked: false, likeCount: 0 };
  }
}

// close database connection (optional, use when app is closing)
export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
