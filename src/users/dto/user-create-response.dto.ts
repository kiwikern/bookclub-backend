import { IsString } from 'class-validator';

export class UserCreateResponseDto {

  @IsString()
  username: string;

  @IsString()
  jwt: string;
}