import { BadRequestException, ForbiddenException, HttpService, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BookCreateRequestDto } from './dto/book-create-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IBook } from './interfaces/book.interface';
import { BookCommentRequestDto } from './dto/book-comment-request.dto';
import { BookUpdateRequestDto } from './dto/book-update-request.dto';
import { IComment } from './interfaces/comment.interface';
import { EntityService } from '../entiy.service.interface';

@Injectable()
export class BooksService implements EntityService {

  constructor(@InjectModel('Books') private readonly booksModel: Model<IBook>,
              private httpService: HttpService) {
  }

  async createBook(userId: string, book: BookCreateRequestDto) {
    const newBook: IBook = await new this.booksModel(book);
    newBook.addedBy = userId;
    return await newBook.save();
  }

  async findById(bookId: string) {
    return await this.booksModel.findById(bookId);
  }

  async addComment(book: IBook, userId: string, comment: BookCommentRequestDto) {
    book.comments.push({ userId, comment: comment.comment } as IComment);
    return await book.save();
  }

  async getAll() {
    return await this.booksModel.find();
  }

  async updateBook(book: IBook, bookUpdate: BookUpdateRequestDto) {
    return await book.update(bookUpdate);
  }

  async deleteBook(book: IBook) {
    if (!book) {
      throw new NotFoundException('Book could not be found');
    }
    return await book.remove();
  }

  async deleteComment(book: IBook, commentId: string, userId: string) {
    const comment = await (book.comments as Types.DocumentArray<any>).id(commentId);
    if (!comment) {
      throw new NotFoundException('Comment could not be found.');
    }
    if (String(comment.userId) !== String(userId)) {
      throw new ForbiddenException('You are not allowed to delete this comment.');
    }
    comment.remove();
    return await book.save();
  }

  async findByIsbn(isbn: string) {
    const formattedIsbn = isbn.replace(/[^\d]/g, '');
    if (![10, 13].includes(formattedIsbn.length)) {
      throw new BadRequestException('Invalid ISBN');
    }
    const google_url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${formattedIsbn}`;
    const response = await this.httpService.get(google_url).toPromise();
    if (response.status !== HttpStatus.OK || response.data.totalItems < 1) {
      throw new NotFoundException('Could not find a corresponding book.');
    }
    return response.data.items[0].volumeInfo;
  }

  async markRead(book: IBook, userId: string) {
    if (!book.readBy.map(r => String(r)).includes(String(userId))) {
      book.readBy.push(userId);
    }
    return await book.save();
  }

  async getOwnerId(bookId: string): Promise<string> {
    const book = await this.findById(bookId);
    return book.addedBy;
  }
}
