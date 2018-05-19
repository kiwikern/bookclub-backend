import { Schema } from 'mongoose';

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
  url: { type: String, required: true },
  author: { type: String, required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: ['Planning', 'Scheduled', 'Discussed', 'Rejected'], default: 'Planning' },
  planningVotes: [VotesSchema],
  discussionVotes: [VotesSchema],
  comments: [CommentsSchema],
  genre: { type: String, enum: ['Sachbuch', 'Lyrik', 'Roman'] },
  tags: [String],
});

BooksSchema.set('toJSON', { virtuals: true, versionKey: false });
