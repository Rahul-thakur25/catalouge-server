import { Schema, Document } from 'mongoose';

export interface Cart extends Document {
  user: { type: Schema.Types.ObjectId; ref: 'User' };
  products: {
    productId: string;
    quantity: number;
  }[];
}

export const CartSchema = new Schema<Cart>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});
