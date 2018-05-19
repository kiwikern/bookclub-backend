import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let app: TestingModule;
  let usersController: UsersController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
  });

  beforeEach(() => {
    usersController = app.get<UsersController>(UsersController);
  });

  describe('login', () => {
    it('should require username', () => {
      expect(usersController.login(null)).toBe('logged in');
    });
  });
});
