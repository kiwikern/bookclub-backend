import { Injectable } from '@nestjs/common';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {

  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {
  }

  async login(loginUser: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    const user: IUser = await this.userModel.findOne({username: loginUser.username});
    if (!user) {
      throw new Error('User not found.');
    }
    return { username: 'user', jwt: 'jwt' };
  }

  async register(user: UserRegisterRequestDto): Promise<UserLoginResponseDto> {
    const newUser = new this.userModel(user);
    await newUser.save();
    return await this.login({ username: user.username, password: user.password });
  }
}
