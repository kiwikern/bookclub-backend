import { IsString } from 'class-validator';

export class UserLoginResDto {

  @IsString()
  username: string;

  @IsString()
  jwt: string;
}