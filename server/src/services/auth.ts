import type { Request } from "express";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import type { UserPayload } from "../types/express/index.js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to authenticate JWT token
// Removed unused JwtPayload interface


export const authenticateToken = (req: Request): UserPayload | undefined => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ").pop()?.trim() || "";
    if (!token) {
      return undefined;
    }
    const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as { data: UserPayload };
    // If the token is valid, attach the user data to the request object
    (req as any).user = data;
    return data;
  } catch (err) {
    console.log("Invalid token");
    return undefined;
  }
};
    // If the token is invalid, log an error message
console.log("Invalid token");

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || "";

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: "UNAUTHENTICATED" } });
    Object.defineProperty(this, "name", {
      value: "AuthenticationError",
    });
  }
};

