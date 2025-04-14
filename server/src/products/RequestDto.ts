// src/types/request-with-user.ts
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
