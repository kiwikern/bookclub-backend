import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { IVote } from '../interfaces/vote.interface';
import { ApiModelProperty } from '@nestjs/swagger';

export class BookVoteRequestDto implements Partial<IVote> {
  @IsNumber()
  @Min(-2)
  @Max(2)
  @ApiModelProperty()
  readonly vote: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  @ApiModelProperty()
  readonly comment?: string;

}