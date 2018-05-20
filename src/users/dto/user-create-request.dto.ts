import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserCreateRequestDto {
  @IsString()
  @Length(3, 30)
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @Length(6, 30)
  @ApiModelProperty()
  readonly password: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiModelProperty()
  readonly email: string;
}