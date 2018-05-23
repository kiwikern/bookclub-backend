import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VotesService } from './votes.service';
import { BooksService } from './books.service';
import { HttpService } from '@nestjs/common';
import { BookVoteRequestDto } from './dto/book-vote-request.dto';
import { IVote } from './interfaces/vote.interface';

describe('VotesService', () => {

  let service: VotesService;
  let booksService: BooksService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        VotesService,
        BooksService,
        { provide: getModelToken('Books'), useValue: null },
        { provide: HttpService, useValue: null }],
    }).compile();

    service = module.get<VotesService>(VotesService);
    booksService = module.get<BooksService>(BooksService);
  });

  describe('aggregateVotes', () => {

    it('should handle empty votes', () => {
      const votes = [];
      expect(VotesService.aggregateVotes(votes)).toBe(0);
    });

    it('should double one vote', async () => {
      const votes = [{ vote: 2, userId: '' }];
      expect(VotesService.aggregateVotes(votes)).toBe(4);
    });

    it('should sum two votes', async () => {
      const votes = [
        { vote: 2, userId: '' },
        { vote: -1, userId: '' },
      ];
      expect(VotesService.aggregateVotes(votes)).toBe(3);
    });

    it('should sum several votes', async () => {
      const votes = [
        { vote: 2, userId: '' },
        { vote: -1, userId: '' },
        { vote: 0, userId: '' },
        { vote: -2, userId: '' },
      ];
      expect(VotesService.aggregateVotes(votes)).toBe(-1);
    });
  });

  describe('addPlanningVote', () => {
    it('should add to empty votes', async () => {
      const book: any = new IBookMock();
      book.planningVotes = [];
      jest.spyOn(book, 'save').mockReturnThis();
      const userId = '';
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service.addPlanningVote(book, userId, vote);
      expect(updatedBook.planningVotes.length).toBe(1);
      expect(updatedBook.planningVotes[0].userId).toBe(userId);
      expect(updatedBook.planningVotes[0].vote).toBe(-2);
    });

    it('should add vote from new user to existing votes', async () => {
      const book: any = new IBookMock();
      book.planningVotes = [{ vote: 2, userId: '1' }];
      jest.spyOn(book, 'save').mockReturnThis();
      const userId = '2';
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service.addPlanningVote(book, userId, vote);
      expect(updatedBook.planningVotes.length).toBe(2);
      expect(updatedBook.planningVotes[0].userId).toBe('1');
      expect(updatedBook.planningVotes[0].vote).toBe(2);
      expect(updatedBook.planningVotes[1].userId).toBe(userId);
      expect(updatedBook.planningVotes[1].vote).toBe(-2);
    });

    it('should update an existing vote', async () => {
      const userId = '2';
      const book: any = new IBookMock();
      book.planningVotes = [{ vote: 2, userId }];
      jest.spyOn(book, 'save').mockReturnThis();
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service.addPlanningVote(book, userId, vote);
      expect(updatedBook.planningVotes.length).toBe(1);
      expect(updatedBook.planningVotes[0].userId).toBe(userId);
      expect(updatedBook.planningVotes[0].vote).toBe(-2);
    });

  });
});

class IBookMock {

  planningVotes: IVote[];

  save() {

  }
}