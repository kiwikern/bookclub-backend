import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true, sparse: true },
  name: String,
});

const removePassword = (doc, ret, options) => {
  delete ret.password;
  return ret;
};

UserSchema.set('toJSON', { virtuals: true, versionKey: false, transform: removePassword });
