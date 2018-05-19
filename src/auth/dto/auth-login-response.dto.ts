import { IsString } from 'class-validator';

export class AuthLoginResponseDto {

  @IsString()
  username: string;

  @IsString()
  jwt: string;
}