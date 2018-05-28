import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VotesService } from './votes.service';
import { BooksService } from './books.service';
import { ForbiddenException, HttpService, NotFoundException } from '@nestjs/common';
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

  const cases = [
    { method: 'addPlanningVote', property: 'planningVotes' },
    { method: 'addDiscussionVote', property: 'discussionVotes' },
  ];

  cases.forEach(c => testVotes(c));

  function testVotes(testCase: {method: string, property: string}) {

  describe(testCase.method, () => {
    it('should add to empty votes', async () => {
      const book: any = new BookMock();
      book[testCase.property] = [];
      jest.spyOn(book, 'save').mockReturnThis();
      const userId = '';
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service[testCase.method](book, userId, vote);
      expect(updatedBook[testCase.property].length).toBe(1);
      expect(updatedBook[testCase.property][0].userId).toBe(userId);
      expect(updatedBook[testCase.property][0].vote).toBe(-2);
    });

    it('should add vote from new user to existing votes', async () => {
      const book: any = new BookMock();
      book[testCase.property] = [{ vote: 2, userId: '1' }];
      jest.spyOn(book, 'save').mockReturnThis();
      const userId = '2';
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service[testCase.method](book, userId, vote);
      expect(updatedBook[testCase.property].length).toBe(2);
      expect(updatedBook[testCase.property][0].userId).toBe('1');
      expect(updatedBook[testCase.property][0].vote).toBe(2);
      expect(updatedBook[testCase.property][1].userId).toBe(userId);
      expect(updatedBook[testCase.property][1].vote).toBe(-2);
    });

    it('should update an existing vote', async () => {
      const userId = '2';
      const book: any = new BookMock();
      book[testCase.property] = [{ vote: 2, userId }];
      jest.spyOn(book, 'save').mockReturnThis();
      const vote: BookVoteRequestDto = { vote: -2 };
      const updatedBook = await service[testCase.method](book, userId, vote);
      expect(updatedBook[testCase.property].length).toBe(1);
      expect(updatedBook[testCase.property][0].userId).toBe(userId);
      expect(updatedBook[testCase.property][0].vote).toBe(-2);
    });

  });
  }
  describe('deleteDiscussionVote', () => {
    it('should delete a vote', async () => {
      const book: any = new BookMock();
      const userId = '1';
      const vote = { vote: -2, userId, id: 'myvote', remove: () => null };
      book.discussionVotes.push(vote);
      jest.spyOn(vote, 'remove');
      jest.spyOn(book, 'save');

      const updatedBook = await service.deleteDiscussionVote(book, 'myvote', userId);

      expect(vote.remove).toBeCalled();
      expect(book.save).toBeCalled();
      expect(updatedBook).toBeTruthy();
    });

    it('should reject on other users\' comments', async () => {
      const book: any = new BookMock();
      const vote = { vote: -2, userId: '1', id: 'myvote', remove: () => null };
      book.discussionVotes.push(vote);
      jest.spyOn(vote, 'remove');

      try {
        await service.deleteDiscussionVote(book, 'myvote', '2');
        fail('Expected exception.');
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
      }
      expect(vote.remove).not.toBeCalled();
    });

    it('should throw an exception when vote not found', async () => {
      const book: any = new BookMock();

      try {
        await service.deleteDiscussionVote(book, 'myvote', '2');
        fail('Expected exception.');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

  });
});

class BookMock {

  planningVotes = new VotesMock();
  discussionVotes = new VotesMock();

  save() {
    return this;
  }
}

class VotesMock extends Array<IVote | any> {

  id(id) {
    return this.find(vote => vote.id === id);
  }

}