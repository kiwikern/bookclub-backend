import { IsString } from 'class-validator';

export class AuthLoginRequestDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}