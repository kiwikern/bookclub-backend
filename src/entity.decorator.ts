import { createParamDecorator, ReflectMetadata } from '@nestjs/common';

export const Entity = createParamDecorator((data, req) => req.entity);
