import { IsString } from 'class-validator';

export class UserLoginResponseDto {

  @IsString()
  username: string;

  @IsString()
  jwt: string;
}