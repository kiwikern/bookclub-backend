import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksSchema } from './schemas/books.schema';
import { BooksController } from './books.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Books', schema: BooksSchema }])],
  controllers: [BooksController],
})
export class BooksModule {
}
