import { Controller, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Get(':userId')
  async getUserDetails(@Param('userId') userId: string, @User('_id') loggedInUserId) {
    if (loggedInUserId + '' !== userId) {
      throw new UnauthorizedException('No access rights');
    }
    const user = await this.userService.findById(userId);
    return user.toJSON();
  }
}
