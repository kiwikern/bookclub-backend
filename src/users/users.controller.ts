import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UsersService } from './users.service';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { UserRegisterRequestDto } from './dto/user-register-request.dto';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    return await this.userService.login(loginUserDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() request: UserRegisterRequestDto): Promise<UserLoginResponseDto> {
    return await this.userService.register(request);
  }
}
