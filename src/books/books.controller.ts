import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookCreateRequestDto } from './dto/book-create-request.dto';
import { BookUpdateRequestDto } from './dto/book-update-request.dto';
import { BookCommentRequestDto } from './dto/book-comment-request.dto';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { User } from '../auth/user.decorator';
import { BooksService } from './books.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { OwnerGuard } from '../auth/owner.guard';
import { Entity } from '../entity.decorator';
import { IBook } from './interfaces/book.interface';

@Controller('/books')
@ApiBearerAuth()
@ApiUseTags('books')
@UseGuards(AuthGuard('jwt'))
export class BooksController {

  constructor(private booksService: BooksService,
              private votesService: VotesService) {
  }

  @ApiOperation({ title: 'All Books', description: 'Returns all books that have been stored in the book club.' })
  @ApiResponse({ status: 200, description: 'Returns all books that are stored.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Get()
  async getAll() {
    return await this.booksService.getAll();
  }

  @ApiOperation({ title: 'ISBN Query', description: 'Finds details for a book by its ISBN.' })
  @ApiResponse({ status: 200, description: 'Book was found, result in body.' })
  @ApiResponse({ status: 400, description: 'Invalid ISBN.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @ApiResponse({ status: 404, description: 'No book found for ISBN.' })
  @Get('/isbn/:isbn')
  async findByIsbn(@Param('isbn') isbn: string) {
    return this.booksService.findByIsbn(isbn);
  }

  @ApiOperation({ title: 'Create Book', description: 'Creates a new book.' })
  @ApiResponse({ status: 201, description: 'Returns the newly created book.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Post()
  async createBook(@Body() book: BookCreateRequestDto,
                   @User('_id') userId: string) {
    return await this.booksService.createBook(userId, book);
  }

  @ApiOperation({ title: 'Update Book', description: 'Updates an existing book. Can only be done by the user who created the book.' })
  @ApiResponse({ status: 200, description: 'Returns the updated book.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Put(':bookId')
  async updateBook(@Entity() book: IBook,
                   @Body() bookUpdate: BookUpdateRequestDto) {
    return await this.booksService.updateBook(book, bookUpdate);
  }

  @ApiOperation({ title: 'Mark Read', description: 'A user can mark a book as read.' })
  @ApiResponse({ status: 200, description: 'Returns the updated book.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Put(':bookId/mark-read')
  async markRead(@Entity() book: IBook,
                 @User('_id') userId: string) {
    return await this.booksService.markRead(book, userId);
  }

  @ApiOperation({ title: 'Delete book', description: 'Deletes an existing book. Can only be done by the creator.' })
  @ApiResponse({ status: 200, description: 'Returns the deleted book.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to delete this book.' })
  @UseGuards(OwnerGuard)
  @Delete(':bookId')
  async deleteBook(@Entity() book: IBook) {
    return await this.booksService.deleteBook(book);

  }

  @ApiOperation({ title: 'Create Comment', description: 'Creates a comment for a book.' })
  @ApiResponse({ status: 201, description: 'Returns the newly created comment.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Post(':bookId/comment')
  async addComment(@User('_id') userId: string,
                   @Entity() book: IBook,
                   @Body() comment: BookCommentRequestDto) {
    return await this.booksService.addComment(book, userId, comment);
  }

  @ApiOperation({ title: 'ISBN Query', description: 'Deletes a comment. Can only be done by the comment\'s creator' })
  @ApiResponse({ status: 200, description: 'Returns the deleted comment.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to delete this comment.' })
  @Delete(':bookId/comment/:commentId')
  async deleteComment(@Entity() book: IBook,
                      @Param('commentId') commentId: string,
                      @User('_id') userId: string) {
    return await this.booksService.deleteComment(book, commentId, userId);
  }

  @ApiOperation({
    title: 'Create Planning Vote',
    description: 'Creates a vote whether a book should be scheduled or rejected. Can only be done once per user.',
  })
  @ApiResponse({ status: 201, description: 'Returns the newly created vote.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Post(':bookId/planning-vote')
  async addPlanningVote(@Entity() book: IBook,
                        @Body() vote: BookVoteRequestDto,
                        @User('_id') userId: string) {
    return await this.votesService.addPlanningVote(book, userId, vote);

  }

  @ApiOperation({
    title: 'Create Discussion Vote',
    description: 'Creates a review for a book after it has been discussed. Can only be done once per user.',
  })
  @ApiResponse({ status: 201, description: 'Returns the newly created vote.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @Post(':bookId/discussion-vote')
  async addDiscussionVote(@Entity() book: IBook,
                          @Body() vote: BookVoteRequestDto,
                          @User('_id') userId) {
    return await this.votesService.addDiscussionVote(book, userId, vote);
  }

  @ApiOperation({ title: 'Delete Discussion Vote', description: 'Deletes a review for a book. Can only be done by the creator.' })
  @ApiResponse({ status: 200, description: 'Returns the deleted vote.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Login is needed.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to delete this vote.' })
  @Delete(':bookId/discussion-vote/:voteId')
  async deleteDiscussionVote(@Entity() book: IBook,
                             @Param('voteId') voteId: string,
                             @User('_id') userId: string) {
    return await this.votesService.deleteDiscussionVote(book, voteId, userId);
  }
}
