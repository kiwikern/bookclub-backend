import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';
import { UserCreateResponseDto } from '../users/dto/user-create-response.dto';
import { UserCreateRequestDto } from '../users/dto/user-create-request.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return await this.authService.register(request);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    return await this.authService.login(loginUserDto);
  }

}
