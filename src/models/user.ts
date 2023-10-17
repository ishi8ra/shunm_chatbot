import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  userEmail: string;
}

const userSchema: Schema = new Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true }
});

export default mongoose.model<IUser>('User', userSchema);
