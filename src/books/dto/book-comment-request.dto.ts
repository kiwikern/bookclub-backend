import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IComment } from '../interfaces/comment.interface';
import { ApiModelProperty } from '@nestjs/swagger';

export class BookCommentRequestDto implements Partial<IComment> {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiModelProperty()
  readonly comment: string;
}