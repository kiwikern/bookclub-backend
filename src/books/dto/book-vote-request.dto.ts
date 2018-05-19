import { IsMongoId, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class BookVoteRequestDto {
  @IsString()
  @IsMongoId()
  readonly userId: string;

  @IsNumber()
  @Min(-5)
  @Max(5)
  readonly vote: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  readonly comment: string;

}