import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { IVote } from '../interfaces/vote.interface';

export class BookVoteRequestDto implements Partial<IVote> {
  @IsNumber()
  @Min(-5)
  @Max(5)
  readonly vote: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly comment: string;

}