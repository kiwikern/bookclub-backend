import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /login', () => {

    it('should accept username', () => {

      const loginRequest = { username: 'username', password: 'password' };
      return request(app.getHttpServer())
        .post('/users/login')
        .send(loginRequest)
        .expect(200)
        .expect({ username: 'user', jwt: 'jwt' });
    });

  });

});
