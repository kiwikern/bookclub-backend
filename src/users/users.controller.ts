import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Entity } from '../entity.decorator';
import { IUser } from './interfaces/user.interface';
import { OwnerGuard } from '../auth/owner.guard';
import { UserUpdateRequestDto } from './dto/user-update-request.dto';

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
  @UseGuards(OwnerGuard)
  @Get(':userId')
  async getUserDetails(@Entity() user: IUser) {
    return user;
  }

  @ApiOperation({title: 'User Details', description: 'Get details for one specific user.'})
  @ApiResponse({ status: 200, description: 'Returns the updated user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. You need to be logged in.' })
  @ApiResponse({ status: 403, description: 'You are not allowed to access this user.' })
  @UseGuards(OwnerGuard)
  @Put(':userId')
  async updateUserDetails(@Entity() user: IUser,
                          @Body() userUpdate: UserUpdateRequestDto) {
    return this.userService.updateUser(user, userUpdate);
  }
}
