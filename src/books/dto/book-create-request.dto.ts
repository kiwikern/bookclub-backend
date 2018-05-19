import { IsIn, IsISBN, IsMongoId, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { BookGenres, BookStates } from '../schemas/books.schema';

export class BookCreateRequestDto {
  @IsString()
  @Length(3, 150)
  readonly title: string;

  @IsString()
  @Length(3, 100)
  readonly author: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly url: string;

  @IsString()
  @IsISBN()
  @IsOptional()
  readonly isbn: string;

  @IsString({ each: true })
  @IsMongoId({ each: true })
  readonly readyBy: string[];

  @IsString()
  @IsMongoId()
  readonly addedBy: string;

  @IsIn(BookStates)
  @IsOptional()
  readonly state: string;

  @IsIn(BookGenres)
  @IsOptional()
  readonly genre: string;

  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];
}