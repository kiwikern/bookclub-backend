import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateRequestDto } from './dto/user-create-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async createUser(user: UserCreateRequestDto): Promise<IUser> {
    const newUser = new this.userModel(user);
    await newUser.save();
    return newUser;
  }

  async findById(userId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return await this.userModel.findById(userId);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await this.userModel.findOne({username});
  }
}
