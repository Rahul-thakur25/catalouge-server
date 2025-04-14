import { Schema, Document, Types } from 'mongoose';

export interface User extends Document {
  _id: Types.ObjectId;
  name: string;
  refreshToken: string;
  email: string;
  products: Types.ObjectId[];
  password: string;
  role: string;
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  refreshToken: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  role: { type: String, default: 'user', enum: ['admin', 'user'] },
});
