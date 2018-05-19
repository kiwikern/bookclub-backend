import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let module: TestingModule;
  let usersController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: null },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  describe('get', () => {

    it('should find user', async () => {
      const response = { toJSON: () => ({ username: 'user', jwt: 'jwt' }) };
      jest.spyOn(userService, 'findById').mockImplementation(() => response);
      const userId = '2';
      const userDetails = await usersController.getUserDetails(userId, { user: { _id: userId } });
      expect(userDetails.username).toBe(response.toJSON().username);
    });

    it('should reject other users', async () => {
      const response = { toJSON: () => ({ username: 'user', jwt: 'jwt' }) };
      jest.spyOn(userService, 'findById').mockImplementation(() => response);
      try {
        await usersController.getUserDetails('2', { user: { _id: '3' } });
        fail('expected an exception to be thrown.');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });

  });
});
