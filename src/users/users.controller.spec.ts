import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let module: TestingModule;
  let usersController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  describe('login', () => {
    it('should successfully login', () => {
      const response = { username: 'user', jwt: 'jwt' };
      jest.spyOn(userService, 'login').mockImplementation(() => response);
      expect(usersController.login(null)).toBe(response);
    });

    it('should rethrow error', () => {
      jest.spyOn(userService, 'login').mockImplementation(() => {
        throw new Error();
      });
      expect(() => usersController.login(null)).toThrow();
    });
  });

});
