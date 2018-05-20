import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookCreateRequestDto } from './dto/book-create-request.dto';
import { BookUpdateRequestDto } from './dto/book-update-request.dto';
import { BookCommentRequestDto } from './dto/book-comment-request.dto';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { User } from '../auth/user.decorator';
import { BooksService } from './books.service';

@Controller('/books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {

  constructor(private booksService: BooksService) {
  }

  @Get()
  async getAll() {
    return await this.booksService.getAll();
  }

  @Post()
  async createBook(@Body() book: BookCreateRequestDto, @User('_id') userId: string) {
    return await this.booksService.createBook(userId, book);
  }

  @Put(':bookId')
  async updateBook(@Param('bookId') bookId: string, @Body() book: BookUpdateRequestDto, @User('_id') userId: string) {
    return await this.booksService.updateBook(bookId, userId, book);
  }

  @Delete(':bookId/comment/:commentId')
  async deleteBook(@Param('bookId') bookId: string,
                   @User('_id') userId: string) {
    return await this.booksService.deleteBook(bookId, userId);

  }

  @Post(':bookId/comment')
  async addComment(@User('_id') userId: string,
                   @Param('bookId') bookId,
                   @Body() comment: BookCommentRequestDto) {
    return await this.booksService.addComment(bookId, userId, comment);
  }

  @Delete(':bookId/comment/:commentId')
  async deleteComment(@Param('bookId') bookId: string,
                      @Param('commentId') commentId: string,
                      @User('_id') userId: string) {
    return await this.booksService.deleteComment(bookId, commentId, userId);
  }

  @Post(':bookId/planning-vote')
  async addPlanningVote(@Param('bookId') bookId: string, @Body() vote: BookVoteRequestDto, @User('_id') userId: string) {
    return await this.booksService.addPlanningVote(bookId, userId, vote);

  }

  @Post(':bookId/discussion-vote')
  async addDiscussionVote(@Param('bookId') bookId: string, @Body() vote: BookVoteRequestDto, @User('_id') userId) {
    return await this.booksService.addDiscussionVote(bookId, userId, vote);
  }

  @Delete(':bookId/discussion-vote/:voteId')
  async deleteDiscussionVote(@Param('bookId') bookId: string,
                             @Param('voteId') voteId: string,
                             @User('_id') userId: string) {
    return await this.booksService.deleteDiscussionVote(bookId, voteId, userId);
  }
}
