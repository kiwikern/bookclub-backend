import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserCreateResponseDto } from './dto/user-create-response.dto';
import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {
  let module: TestingModule;
  let userService: UsersService;
  let userModel;
  let userModelInstance;

  beforeEach(async () => {
    userModelInstance = {
      save: () => {},
    };
    userModel = jest.fn(() => userModelInstance);
    userModel.findById = () => {};
    userModel.findOne = () => {};
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: userModel },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const originalUser: any = new UserMock();
      originalUser.username = 'old';
      jest.spyOn(originalUser, 'save').mockReturnThis();
      const userUpdate = { username: 'new' };
      const updatedUser = await userService.updateUser(originalUser, userUpdate);
      expect(updatedUser.username).toBe(originalUser.username);
    });
  });

  describe('createUser', () => {
    it('create a new user', async () => {
      const newUser: any = new UserMock();
      newUser.username = 'new';
      jest.spyOn(userModelInstance, 'save').mockReturnValue(newUser);
      const newUserResult = await userService.createUser(newUser);
      expect(userModelInstance.save).toHaveBeenCalled();
      expect(newUserResult.username).toBe(newUser.username);
    });
  });

  describe('findById', () => {
    it('should reject invalid ObjectId', async () => {
      try {
        await userService.findById('invalid');
        fail('Expected Exception');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('should return a user', async () => {
      const expectedUser = {id: 'id'};
      jest.spyOn(userModel, 'findById').mockImplementation(() => expectedUser);
      const user = await userService.findById(ObjectId.createFromTime(2) + '');
      expect(user).toBe(expectedUser);
    });
  });

  describe('findByUsername', () => {
    it('should return a user', async () => {
      const expectedUser = {id: 'id'};
      jest.spyOn(userModel, 'findOne').mockImplementation(() => expectedUser);
      const user = await userService.findByUsername('');
      expect(user).toBe(expectedUser);
    });
  });

  describe('getOwnerId', () => {
    it('should return the id', async () => {
      const entityId = 'entity';
      const ownerId = await userService.getOwnerId(entityId);
      expect(ownerId).toBe(entityId);
    });
  });
});

class UserMock extends UserCreateResponseDto {
  set() {
  }

  save() {
  }
}

class ModelMock {
  constructor() {
    return this.create();
  }

  create() {
    return null;
  }
}
