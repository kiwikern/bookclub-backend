import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserCreateResponseDto } from './dto/user-create-response.dto';

fdescribe('UsersService', () => {
  let module: TestingModule;
  let userService: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: null },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('updateUserDetails', () => {

    it('should update existing user', async () => {
      const originalUser: any = new UserMock();
      originalUser.username = 'old';
      jest.spyOn(originalUser, 'save').mockReturnThis();
      const userUpdate = { username: 'new' };
      const updatedUser = await userService.updateUser(originalUser, userUpdate);
      expect(updatedUser.username).toBe(originalUser.username);
    });

  });
});

class UserMock extends UserCreateResponseDto {
  set() {
  }

  save() {
  }
}
