import { IsString } from 'class-validator';

export class UserLoginRequestDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}