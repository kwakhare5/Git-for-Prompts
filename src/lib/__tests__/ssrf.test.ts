import { describe, it, expect } from 'vitest';
import { isPrivateOrReservedIp, validateWebhookUrl } from '../security/ssrf';

describe('SSRF Protection & IP Classification Engine', () => {
  describe('isPrivateOrReservedIp', () => {
    it('blocks IPv4 loopback (127.0.0.1, 127.0.0.2)', () => {
      expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('127.0.0.2')).toBe(true);
    });

    it('blocks IPv6 loopback (::1)', () => {
      expect(isPrivateOrReservedIp('::1')).toBe(true);
      expect(isPrivateOrReservedIp('0:0:0:0:0:0:0:1')).toBe(true);
    });

    it('blocks RFC1918 private IPv4 ranges (10.x, 172.16-31.x, 192.168.x)', () => {
      expect(isPrivateOrReservedIp('10.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('10.255.255.255')).toBe(true);
      expect(isPrivateOrReservedIp('172.16.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('172.31.255.255')).toBe(true);
      expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
    });

    it('blocks link-local & cloud metadata IPs (169.254.169.254)', () => {
      expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
      expect(isPrivateOrReservedIp('169.254.0.1')).toBe(true);
    });

    it('blocks IPv4-mapped IPv6 loopback & private IPs', () => {
      expect(isPrivateOrReservedIp('::ffff:127.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('::ffff:10.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('::ffff:169.254.169.254')).toBe(true);
    });

    it('allows valid public IPv4 and IPv6 addresses', () => {
      expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
      expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
      expect(isPrivateOrReservedIp('2606:4700:4700::1111')).toBe(false);
    });
  });

  describe('validateWebhookUrl', () => {
    it('rejects non-HTTPS HTTP URLs', async () => {
      const res = await validateWebhookUrl('http://example.com/webhook');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('HTTPS');
    });

    it('rejects URLs containing embedded credentials', async () => {
      const res = await validateWebhookUrl('https://admin:secret@example.com/webhook');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('credentials');
    });

    it('rejects non-443 ports', async () => {
      const res = await validateWebhookUrl('https://example.com:8443/webhook');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('Port 8443 is not allowed');
    });

    it('rejects direct connection to 127.0.0.1', async () => {
      const res = await validateWebhookUrl('https://127.0.0.1/webhook');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('blocked');
    });

    it('rejects direct connection to 169.254.169.254 metadata endpoint', async () => {
      const res = await validateWebhookUrl('https://169.254.169.254/latest/meta-data');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('blocked');
    });

    it('rejects hostname resolving to private IP (DNS rebinding / internal host)', async () => {
      const mockResolver = async () => [{ address: '192.168.1.50', family: 4 }];
      const res = await validateWebhookUrl('https://internal-server.local/webhook', mockResolver);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('resolved to private/reserved IP');
    });

    it('approves valid public HTTPS URL and returns pinned IP URL', async () => {
      const mockResolver = async () => [{ address: '93.184.216.34', family: 4 }];
      const res = await validateWebhookUrl('https://example.com/webhook', mockResolver);
      expect(res.valid).toBe(true);
      expect(res.resolvedIps).toEqual(['93.184.216.34']);
      expect(res.pinnedUrl).toBe('https://93.184.216.34/webhook');
    });
  });
});
