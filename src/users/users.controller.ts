import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @Get(':userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserDetails(@Param('userId') userId, @Req() req) {
    return await this.userService.findById(userId);
  }
}
