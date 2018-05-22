import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { BooksService } from './books.service';

@Injectable()
export class BooksMiddleware implements NestMiddleware {

  constructor(private readonly booksService: BooksService) {
  }

  resolve(context: string): MiddlewareFunction {
    return async (req, res, next) => {
      const bookId = req.params.bookId;
      if (!bookId) {
        return next();
      }
      const book = await this.booksService.findById(bookId);
      if (!book) {
        return next();
      }
      const ownerId = book.addedBy;
      req.entity = book;
      req.ownerId = ownerId;
      next();
    };
  }
}
