import { IsString } from 'class-validator';

export class UserLoginReqDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}