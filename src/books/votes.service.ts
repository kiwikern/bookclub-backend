import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { IVote } from './interfaces/vote.interface';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { Types } from 'mongoose';

@Injectable()
export class VotesService {
  constructor(private readonly booksService: BooksService) {
  }

  async addDiscussionVote(bookId: string, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(bookId, userId, vote, 'discussionVotes');
  }

  async addPlanningVote(bookId: string, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(bookId, userId, vote, 'planningVotes');
  }

  async deleteDiscussionVote(bookId: string, voteId: string, userId: string) {
    const book = await this.booksService.findBookById(bookId);
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

  private async addVote(bookId: string, userId: string, vote: BookVoteRequestDto, type: string) {
    const book = await this.booksService.findBookById(bookId);
    const index = book[type].findIndex(v => String(v.userId) === String(userId));
    if (index !== -1) {
      book[type].splice(index, 1);
    }
    book[type].push(Object.assign({ userId }, vote) as IVote);
    return await book.save();
  }
}
