import { Schema } from 'mongoose';
import { VotesService } from '../votes.service';

export const BookStates = ['Planning', 'Scheduled', 'Discussed', 'Rejected'];
export const BookGenres = ['Sachbuch', 'Lyrik', 'Roman'];

const VotesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: Number, min: -2, max: 2, required: true },
  comment: String,
});

const CommentsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: String,
});

export const BooksSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String },
  isbn: { type: String },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  state: { type: String, enum: BookStates, default: BookStates[0] },
  planningVotes: [VotesSchema],
  discussionVotes: [VotesSchema],
  comments: [CommentsSchema],
  genre: { type: String, enum: BookGenres },
  tags: [String],
});

BooksSchema.virtual('aggregatedDiscussionVotes', {})
  .get(function() {
    return VotesService.aggregateVotes(this.discussionVotes);
  });

BooksSchema.virtual('aggregatedPlanningVotes', {})
  .get(function() {
    return VotesService.aggregateVotes(this.planningVotes);
  });

BooksSchema.set('toJSON', { virtuals: true, versionKey: false });
