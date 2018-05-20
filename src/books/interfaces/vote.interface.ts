import { IComment } from './comment.interface';

export interface IVote extends IComment {
  vote: number;
}