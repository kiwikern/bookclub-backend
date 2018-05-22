import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { EntityMiddleware } from '../entity.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {
  constructor(private usersService: UsersService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EntityMiddleware)
      .with([this.usersService, 'userId'])
      .forRoutes(UsersController);
  }
}
