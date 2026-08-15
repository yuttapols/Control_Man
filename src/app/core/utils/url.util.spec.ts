import { isSafeExternalUrl, isTrustedApiUrl, joinUrl, sanitizeReturnUrl } from './url.util';

describe('url util', () => {
  describe('sanitizeReturnUrl', () => {
    it('keeps a relative application path', () => {
      expect(sanitizeReturnUrl('/holidays?year=2026')).toBe('/holidays?year=2026');
    });

    it('rejects absolute and protocol relative urls', () => {
      expect(sanitizeReturnUrl('https://evil.example/steal')).toBe('/dashboard');
      expect(sanitizeReturnUrl('//evil.example/steal')).toBe('/dashboard');
      expect(sanitizeReturnUrl('/\\evil.example')).toBe('/dashboard');
      expect(sanitizeReturnUrl('javascript:alert(1)')).toBe('/dashboard');
    });

    it('falls back when value is empty', () => {
      expect(sanitizeReturnUrl(null)).toBe('/dashboard');
      expect(sanitizeReturnUrl(undefined, '/login')).toBe('/login');
    });
  });

  describe('isTrustedApiUrl', () => {
    it('accepts urls under the configured api base', () => {
      expect(isTrustedApiUrl('/api/v1/portal/auth/login', '/api/v1/portal')).toBe(true);
    });

    it('rejects other origins and other paths', () => {
      expect(isTrustedApiUrl('https://evil.example/api/v1/portal/auth', '/api/v1/portal')).toBe(
        false,
      );
      expect(isTrustedApiUrl('/api/v1/holidays', '/api/v1/portal')).toBe(false);
    });
  });

  describe('isSafeExternalUrl', () => {
    it('allows http and https only', () => {
      expect(isSafeExternalUrl('https://ratchakitcha.soc.go.th/announce')).toBe(true);
      expect(isSafeExternalUrl('http://example.local')).toBe(true);
      expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
      expect(isSafeExternalUrl('')).toBe(false);
    });
  });

  describe('joinUrl', () => {
    it('normalizes slashes', () => {
      expect(joinUrl('http://host/api/', '/auth/login')).toBe('http://host/api/auth/login');
      expect(joinUrl('http://host/api', 'auth/login')).toBe('http://host/api/auth/login');
    });
  });
});
