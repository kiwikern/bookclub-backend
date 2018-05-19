import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class BookCommentRequestDto {
  @IsString()
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly comment: string;
}