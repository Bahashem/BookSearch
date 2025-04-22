declare namespace Express {
  interface Request {
    user: {
      _id: unknown;
      username: string;
    };
  }
}

export typeUserPayload = {
  _id: string;
  username?: string;
  email?: string;
};

export interface Context {
  req: {user?: UserPayload;
} 