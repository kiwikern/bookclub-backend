import { EntityMiddleware } from './entity.middleware';
import { EntityService } from './entiy.service.interface';
import { Document } from 'mongoose';
import { MiddlewareFunction, NotFoundException } from '@nestjs/common';

describe('EntityMiddleware', () => {

  let entityMiddleware: EntityMiddleware;
  beforeEach(() => {
    entityMiddleware = new EntityMiddleware();
  });

  it('should set entity on request', async () => {
    const req: any = { params: { entityParam: 'entityId' } };
    await runMiddleware(req);
    expect(req.entity).toBe('myEntity');
  });

  it('should not set entity on missing param', async () => {
    const req: any = { params: { entityParam: 'entityId' } };
    await runMiddleware(req, 'NonExistingParam');
    expect(req.entity).toBeUndefined();
  });

  it('should throw 404 on missing entity', async () => {
    const req: any = { params: { entityParam: 'nonExistingEntityId' } };
    try {
      await runMiddleware(req);
      fail('Exception Expected');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  const runMiddleware = async (req, idParam = 'entityParam') => {
    const entityService: EntityService = new EntityServiceMock();
    jest.spyOn(entityService, 'findById')
      .mockImplementation(paramValue => paramValue === 'entityId' ? 'myEntity' : null);
    jest.spyOn(entityService, 'getOwnerId')
      .mockReturnValue('ownerId');
    const middleware: MiddlewareFunction = entityMiddleware.resolve([entityService, idParam]);
    await middleware(req, null, () => null);
  };

});

class EntityServiceMock implements EntityService {
  findById(entityId: string): Promise<Document> {
    return null;
  }

  getOwnerId(entityId: string): Promise<string> {
    return undefined;
  }

}