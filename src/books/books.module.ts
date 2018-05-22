import { HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksSchema } from './schemas/books.schema';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { VotesService } from './votes.service';
import { BooksMiddleware } from './books.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Books', schema: BooksSchema }]),
    HttpModule
  ],
  controllers: [BooksController],
  providers: [BooksService, VotesService],
})
export class BooksModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BooksMiddleware)
      .forRoutes(BooksController);
  }
}
