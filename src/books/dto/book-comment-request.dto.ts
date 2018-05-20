import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IComment } from '../interfaces/comment.interface';

export class BookCommentRequestDto implements Partial<IComment> {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly comment: string;
}