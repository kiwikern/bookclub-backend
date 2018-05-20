import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthLoginResponseDto {

  @IsString()
  @ApiModelProperty()
  username: string;

  @IsString()
  @ApiModelProperty()
  jwt: string;
}