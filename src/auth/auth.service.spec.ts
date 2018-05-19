import { AuthService } from './auth.service';

describe('UserService', () => {

  let service: AuthService;
  beforeEach(() => {
    service = new AuthService();
  });

  it('should create and verify a token', () => {
    const token: string = service.generateToken('username');
    expect(token).toBeTruthy();
  });

  it('should encrypt and verify a password', () => {
    const encrypted: string = service.encryptPassword('password');
    expect(encrypted).toBeTruthy();
    expect(service.verifyPassword('password', encrypted)).toBe(true);
  });

  it('should reject a wrong password', () => {
    expect(service.verifyPassword('password', 'false'))
      .toBe(false);
  });
});