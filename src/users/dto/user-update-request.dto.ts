import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserUpdateRequestDto {
  @IsString()
  @Length(3, 30)
  @IsOptional()
  @ApiModelProperty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiModelProperty()
  readonly email?: string;
}