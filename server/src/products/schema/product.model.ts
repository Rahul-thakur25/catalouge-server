import { Schema, Document, Types } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  user: Types.ObjectId;
  images: string[];
}

export const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
});
