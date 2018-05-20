import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserCreateResponseDto {

  @IsString()
  @ApiModelProperty()
  username: string;

  @IsString()
  @ApiModelProperty()
  jwt: string;
}