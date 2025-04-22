import type { Request } from "express";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import type { UserPayload } from "../types/express.js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to authenticate JWT token
interface JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

export const authenticateToken = (req: Request): UserPayload | undefined => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }
  if (!token) {
    return req;
  }
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", {
      maxAge: "2hr",
    });
    // If the token is valid, attach the user data to the request object
    req.jason = { token, user: data };
  } catch (err) {
    // If the token is invalid, log an error message
    console.log("Invalid token");
  }

  // Return the request object
  return req;
};

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
}
