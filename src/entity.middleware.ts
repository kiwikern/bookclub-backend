import { Injectable, MiddlewareFunction, NestMiddleware, NotFoundException } from '@nestjs/common';
import { EntityService } from './entiy.service.interface';

@Injectable()
export class EntityMiddleware implements NestMiddleware {

  resolve([entityService, idParam]: [EntityService, string]): MiddlewareFunction {
    return async (req, res, next) => {
      const entityId = req.params[idParam];
      if (!entityId) {
        return next();
      }
      const entity = await entityService.findById(entityId);
      if (!entity) {
        throw new NotFoundException(`Entity ${entityId} does not exist.`);
      }
      const ownerId = await entityService.getOwnerId(entityId);
      req.entity = entity;
      req.ownerId = ownerId;
      next();
    };
  }
}
