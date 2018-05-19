import { IsOptional, IsString } from 'class-validator';

export class UserRegisterRequestDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly email: string;
}