import { Document } from 'mongoose';

export interface EntityService {
  findById(entityId: string): Promise<Document>;
  getOwnerId(entityId: string): Promise<string>;
}