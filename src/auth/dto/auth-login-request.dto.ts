import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class AuthLoginRequestDto {
  @IsString()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @ApiModelProperty()
  readonly password: string;
}