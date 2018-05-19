import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { IJwtPayload } from './jwt-payload.interface';
import { IUser } from '../users/interfaces/user.interface';
import { AuthLoginRequestDto } from './dto/auth-login-request.dto';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { UserCreateResponseDto } from '../users/dto/user-create-response.dto';
import { UserCreateRequestDto } from '../users/dto/user-create-request.dto';

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService) {
  }

  async login(loginDto: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Unknown user');
    }
    if (!this.verifyPassword(loginDto.password, user.password)) {
      throw new UnauthorizedException('Wrong password');
    }
    const jwt = this.generateToken(user.id);
    return { username: user.username, jwt };
  }

  async register(user: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    // TODO: encrypt password
    const newUser = await this.usersService.createUser(user);
    const jwt = await this.generateToken(newUser._id);
    return { username: newUser.username, jwt };
  }

  async verifyUser(token: IJwtPayload): Promise<IUser> {
    return await this.usersService.findById(token.userId);
  }

  private generateToken(userId: string): string {
    const expiresIn = '30d';
    // TODO: Inject secret
    return sign({ userId }, 'secret', { expiresIn });
  }

  private encryptPassword(password: string): string {
    return '';
  }

  private verifyPassword(password: string, encryptedPassword: string): boolean {
    return true;
  }

}
