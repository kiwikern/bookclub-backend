import { Controller, ForbiddenException, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {

  constructor(private userService: UsersService) {
  }

  @ApiOperation({title: 'User Details', description: 'Get details for one specific user.'})
  @ApiResponse({ status: 200, description: 'Returns the user for this id.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. You need to be logged in.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to access this user.' })
  @Get(':userId')
  async getUserDetails(@Param('userId') userId: string, @User('_id') loggedInUserId) {
    if (loggedInUserId + '' !== userId) {
      throw new ForbiddenException('No access rights');
    }
    return this.userService.findById(userId);
  }

  @ApiOperation({title: 'User Details', description: 'Get details for one specific user.'})
  @ApiResponse({ status: 200, description: 'Returns the updated user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. You need to be logged in.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to access this user.' })
  @Put(':userId')
  async updateUserDetails(@Param('userId') userId: string, @User('_id') loggedInUserId) {
    if (loggedInUserId + '' !== userId) {
      throw new ForbiddenException('No access rights');
    }
    const user = await this.userService.findById(userId);
    return user.toJSON();
  }
}
