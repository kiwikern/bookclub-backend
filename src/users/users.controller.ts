import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return 'logged in';
  }
}
