import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookCreateRequestDto } from './dto/book-create-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IBook } from './interfaces/book.interface';
import { BookCommentRequestDto } from './dto/book-comment-request.dto';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { BookUpdateRequestDto } from './dto/book-update-request.dto';
import { IVote } from './interfaces/vote.interface';
import { IComment } from './interfaces/comment.interface';

@Injectable()
export class BooksService {

  constructor(@InjectModel('Books') private readonly booksModel: Model<IBook>) {
  }

  async createBook(userId: string, book: BookCreateRequestDto) {
    const newBook: IBook = await new this.booksModel(book);
    newBook.addedBy = userId;
    return await newBook.save();
  }

  async findBookById(bookId: string) {
    return await this.booksModel.findById(bookId);
  }

  async addComment(bookId: string, userId: string, comment: BookCommentRequestDto) {
    const book = await this.findBookById(bookId);
    book.comments.push({ userId, comment: comment.comment } as IComment);
    return await book.save();
  }

  async addDiscussionVote(bookId: string, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(bookId, userId, vote, 'discussionVotes');
  }

  async addPlanningVote(bookId: string, userId: string, vote: BookVoteRequestDto) {
    return this.addVote(bookId, userId, vote, 'planningVotes');
  }

  private async addVote(bookId: string, userId: string, vote: BookVoteRequestDto, type: string) {
    const book = await this.findBookById(bookId);
    const index = book[type].findIndex(v => String(v.userId) === String(userId));
    if (index !== -1) {
      book[type].splice(index, 1);
    }
    book[type].push(Object.assign({ userId }, vote) as IVote);
    return await book.save();
  }

  async getAll() {
    return await this.booksModel.find();
  }

  async updateBook(bookId: string, userId: string, bookUpdate: BookUpdateRequestDto) {
    const book = await this.findBookById(bookId);
    if (String(book.addedBy) !== String(userId)) {
      throw new UnauthorizedException('You are not allowed to update this book.');
    }
    return await book.update(bookUpdate);
  }

  async deleteBook(bookId: string, userId: string) {
    const book = await this.findBookById(bookId);
    if (!book) {
      throw new NotFoundException('Book could not be found');
    }
    if (String(book.addedBy) !== String(userId)) {
      throw new UnauthorizedException('You are not allowed to delete this comment.');
    }
    return await book.remove();
  }

  async deleteComment(bookId: string, commentId: string, userId: string) {
    const book = await this.findBookById(bookId);
    const comment = await (book.comments as Types.DocumentArray<any>).id(commentId);
    if (!comment) {
      throw new NotFoundException('Comment could not be found.');
    }
    if (String(comment.userId) !== String(userId)) {
      throw new UnauthorizedException('You are not allowed to delete this comment.');
    }
    comment.remove();
    return await book.save();
  }

  async deleteDiscussionVote(bookId: string, voteId: string, userId: string) {
    const book = await this.findBookById(bookId);
    const vote = await (book.discussionVotes as Types.DocumentArray<any>).id(voteId);
    if (!vote) {
      throw new NotFoundException('Vote could not be found.');
    }
    if (String(vote.userId) !== String(userId)) {
      throw new UnauthorizedException('You are not allowed to delete this vote.');
    }
    vote.remove();
    return await book.save();
  }
}
