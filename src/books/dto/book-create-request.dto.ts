import { IsIn, IsISBN, IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BookGenres, BookStates } from '../schemas/books.schema';
import { ApiModelProperty } from '@nestjs/swagger';

export class BookCreateRequestDto {
  @IsString()
  @Length(3, 150)
  @ApiModelProperty()
  readonly title: string;

  @IsString()
  @Length(3, 100)
  @ApiModelProperty()
  readonly author: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiModelProperty()
  readonly url: string;

  @IsString()
  @IsISBN()
  @IsOptional()
  @ApiModelProperty()
  readonly isbn: string;

  @IsString({ each: true })
  @IsMongoId({ each: true })
  @ApiModelProperty({type: String, isArray: true})
  readonly readBy: string[];

  @IsIn(BookGenres)
  @IsOptional()
  @ApiModelProperty()
  readonly genre: string;

  @IsIn(BookStates)
  @IsOptional()
  @ApiModelProperty()
  readonly state: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiModelProperty({type: String, isArray: true})
  readonly tags: string[];
}