import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {

  let service: AuthService;
  let usersService: UsersService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: getModelToken('User'), useValue: null }],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should login', async () => {
    const loginDto = { username: 'user', password: 'password' };
    jest.spyOn(usersService, 'findByUsername').mockImplementation(username => {
      expect(username).toEqual(loginDto.username);
      const password = '$2b$10$XC4NoAiTVDt7oe6Hjtqr4uEKfI71RbqvWuVG3s7uFgz8TZvbLGaBe';
      return Object.assign({}, loginDto, { id: '123', password });
    });
    const response: AuthLoginResponseDto = await service.login(loginDto);
    expect(response).toBeTruthy();
  });

  it('should not login when user not found', async () => {
    const loginDto = { username: 'user', password: 'password' };
    jest.spyOn(usersService, 'findByUsername').mockImplementation(username => {
      expect(username).toEqual(loginDto.username);
      return null;
    });
    try {
      await service.login(loginDto);
      fail('Expected error');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should not login when password does not match', async () => {
    const loginDto = { username: 'user', password: 'password' };
    jest.spyOn(usersService, 'findByUsername').mockImplementation(username => {
      const password = '$2b$10$XC4NoAiTVDt7oe6Hjtqr4uEKfI71RbqvWuVG3s7uFgz5TZvbLGaBe';
      return Object.assign({}, loginDto, { id: '123', password });
    });
    try {
      await service.login(loginDto);
      fail('Expected error');
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('should register', async () => {
    const registerDto = { username: 'user', password: 'pw', email: null };
    jest.spyOn(usersService, 'createUser').mockImplementation(dto => {
      expect(dto.username).toEqual(registerDto.username);
      const password = '$2b$10$XC4NoAiTVDt7oe6Hjtqr4uEKfI71RbqvWuVG3s7uFgz8TZvbLGaBe';
      return Object.assign({}, registerDto, { id: '123', password });
    });
    const response: AuthLoginResponseDto = await service.register(registerDto);
    expect(response).toBeTruthy();
  });

  it('should verify user', async () => {
    jest.spyOn(usersService, 'findById').mockReturnValue('user');
    const user = await service.verifyUser({ userId: 'id' });
    expect(user).toBe('user');
  });

});