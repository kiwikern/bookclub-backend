import { Document } from 'mongoose';

export interface IComment extends Document {
  userId: string;
  comment: string;
}