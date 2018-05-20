import { Document } from 'mongoose';
import { IVote } from './vote.interface';
import { IComment } from './comment.interface';

export interface IBook extends Document {
  title: string;
  author: string;
  url?: string;
  isbn?: string;
  readBy: string[];
  addedBy: string;
  state: string;
  planningVotes: IVote[];
  discussionVotes: IVote[];
  comments: IComment[];
  genre: string;
  tags?: string[];
}