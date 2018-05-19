import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginReqDto } from './dto/user-login-req.dto';
import { UsersService } from './users.service';
import { UserLoginResDto } from './dto/user-login-res.dto';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: UserLoginReqDto): UserLoginResDto {
    return this.userService.login(loginUserDto);
  }
}
