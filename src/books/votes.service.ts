import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { IVote } from './interfaces/vote.interface';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { Types } from 'mongoose';
import { IBook } from './interfaces/book.interface';

@Injectable()
export class VotesService {
  constructor(private readonly booksService: BooksService) {
  }

  async addDiscussionVote(book: IBook, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(book, userId, vote, 'discussionVotes');
  }

  async getDiscussionVotes(book: IBook) {
    return book.discussionVotes;
  }

  async deleteDiscussionVote(book: IBook, voteId: string, userId: string) {
    const vote = await (book.discussionVotes as Types.DocumentArray<any>).id(voteId);
    if (!vote) {
      throw new NotFoundException('Vote could not be found.');
    }
    if (String(vote.userId) !== String(userId)) {
      throw new ForbiddenException('You are not allowed to delete this vote.');
    }
    vote.remove();
    return await book.save();
  }

  async addPlanningVote(book: IBook, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(book, userId, vote, 'planningVotes');
  }

  async getPlanningVotes(bookId: string) {
    const book = await this.booksService.findById(bookId);
    return book.planningVotes;
  }

  private async addVote(book: IBook, userId: string, vote: BookVoteRequestDto, type: string) {
    const index = book[type].findIndex(v => String(v.userId) === String(userId));
    if (index !== -1) {
      book[type].splice(index, 1);
    }
    book[type].push(Object.assign({ userId }, vote) as IVote);
    return await book.save();
  }

  static aggregateVotes(votes: IVote[]) {
    return votes.reduce((sum, v) => sum + (Math.abs(v.vote) * v.vote), 0);
  }
}
