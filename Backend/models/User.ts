import { Schema, model } from "mongoose";

export interface UserDocument {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<UserDocument>("User", userSchema);

export default User;
