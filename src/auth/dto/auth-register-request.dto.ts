import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class AuthRegisterRequestDto {
  @IsString()
  @Length(3, 30)
  readonly username: string;

  @IsString()
  @Length(6, 30)
  readonly password: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}