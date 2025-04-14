import { Request } from 'express';
export class registerDto extends Request {
  name: string;
  refreshToken: string;
  email: string;
  password: string;
  role: string;
}
