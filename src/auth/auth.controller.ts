import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';
import { UserCreateResponseDto } from '../users/dto/user-create-response.dto';
import { UserCreateRequestDto } from '../users/dto/user-create-request.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @ApiOperation({title: 'Sign-Up', description: 'Register a new user.'})
  @ApiResponse({ status: 201, description: 'Returns the newly created vote.' })
  @ApiResponse({ status: 400, description: 'You need to provide a proper username and password.' })
  @Post('register')
  async register(@Body() request: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return this.authService.register(request);
  }

  @ApiOperation({title: 'Sign-In', description: 'Login with username and password.'})
  @ApiResponse({ status: 200, description: 'Returns a jwt for the logged in user.' })
  @ApiResponse({ status: 400, description: 'You need to provide a proper username and password.' })
  @ApiResponse({ status: 401, description: 'Wrong username or password.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    return this.authService.login(loginUserDto);
  }

}
