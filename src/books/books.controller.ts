import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookCreateRequestDto } from './dto/book-create-request.dto';
import { BookUpdateRequestDto } from './dto/book-update-request.dto';
import { BookCommentRequestDto } from './dto/book-comment-request.dto';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { User } from '../auth/user.decorator';

@Controller('/books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {

  @Get()
  getAll() {
    return [];
  }

  @Post()
  createBook(@Body() book: BookCreateRequestDto, @User('_id') userId: string) {

  }

  @Put(':bookId')
  updateBook(@Param() bookId: string, @Body() book: BookUpdateRequestDto, @User('_id') userId: string) {
    return { bookId, book, userId };
  }

  @Post(':bookId/comment')
  addComment(@Body() comment: BookCommentRequestDto, @User('_id') userId: string) {

  }

  @Post(':bookId/planning-vote')
  addPlanningVote(@Body() vote: BookVoteRequestDto, @User('_id') userId: string) {

  }

  @Post(':bookId/discussion-vote')
  addDiscussionVote(@Body() vote: BookVoteRequestDto, @User('_id') userId) {

  }

}
