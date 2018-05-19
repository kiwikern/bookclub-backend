import { Controller, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserDetails(@Param('userId') userId: string, @Req() req) {
    if (!req.user  || !req.user._id || req.user._id + '' !== userId) {
      throw new UnauthorizedException('No access rights');
    }
    const user = await this.userService.findById(userId);
    return user.toJSON();
  }
}
