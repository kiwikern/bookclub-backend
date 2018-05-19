import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksSchema } from './schemas/books.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Books', schema: BooksSchema }])],
})
export class BooksModule {
}
