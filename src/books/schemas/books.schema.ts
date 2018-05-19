import { Schema } from 'mongoose';

export const BookStates = ['Planning', 'Scheduled', 'Discussed', 'Rejected'];
export const BookGenres = ['Sachbuch', 'Lyrik', 'Roman'];

const VotesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: Number, min: -5, max: 5, required: true },
  comment: String,
});

const CommentsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: String,
});

export const BooksSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String },
  isbn: { type: String },
  author: { type: String, required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: BookStates, default: BookStates[0] },
  planningVotes: [VotesSchema],
  discussionVotes: [VotesSchema],
  comments: [CommentsSchema],
  genre: { type: String, enum: BookGenres },
  tags: [String],
});

BooksSchema.set('toJSON', { virtuals: true, versionKey: false });
