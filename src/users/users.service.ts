import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateRequestDto } from './dto/user-create-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { EntityService } from '../entiy.service.interface';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';

@Injectable()
export class UsersService implements EntityService {

  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async createUser(user: UserCreateRequestDto): Promise<IUser> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findById(userId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return this.userModel.findById(userId);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.userModel.findOne({username});
  }

  async getOwnerId(entityId: string): Promise<string> {
    return entityId;
  }

  updateUser(user: IUser, userUpdate: UserUpdateRequestDto) {
    user.set(userUpdate);
    return user.save();
  }
}
