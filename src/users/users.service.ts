import { Injectable } from '@nestjs/common';
import { UserLoginReqDto } from './dto/user-login-req.dto';
import { UserLoginResDto } from './dto/user-login-res.dto';

@Injectable()
export class UsersService {

  login(loginUser: UserLoginReqDto): UserLoginResDto {
    return {username: 'user', jwt: 'jwt'};
  }
}
