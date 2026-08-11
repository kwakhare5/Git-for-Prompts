import { lookup } from 'dns/promises';
import { isIP } from 'net';

export interface SsrfValidationResult {
  valid: boolean;
  reason?: string;
  resolvedIps?: string[];
  pinnedUrl?: string;
}

/**
 * Checks if a string or IPv4/IPv6 address falls into private, loopback, link-local,
 * multicast, cloud metadata, or reserved IP ranges.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1 -> 127.0.0.1)
  let normalizedIp = ip.trim();
  if (normalizedIp.toLowerCase().startsWith('::ffff:')) {
    normalizedIp = normalizedIp.substring(7);
  }

  // Handle IPv4
  if (isIP(normalizedIp) === 4) {
    const parts = normalizedIp.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true; // Malformed IPv4
    }

    const [a, b, c] = parts;

    // 0.0.0.0/8 (Current network / "this" network)
    if (a === 0) return true;

    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;

    // 10.0.0.0/8 (Private RFC1918)
    if (a === 10) return true;

    // 172.16.0.0/12 (Private RFC1918)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.168.0.0/16 (Private RFC1918)
    if (a === 192 && b === 168) return true;

    // 169.254.0.0/16 (Link-Local & Cloud Metadata 169.254.169.254)
    if (a === 169 && b === 254) return true;

    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET-1, TEST-NET-2, TEST-NET-3)
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;

    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
    if (a >= 224) return true;

    return false;
  }

  // Handle IPv6
  if (isIP(normalizedIp) === 6) {
    const lower = normalizedIp.toLowerCase();

    // Loopback ::1 or ::
    if (lower === '::1' || lower === '::' || lower === '0:0:0:0:0:0:0:1' || lower === '0:0:0:0:0:0:0:0') {
      return true;
    }

    // Unique Local Unicast fc00::/7 (fc00:: and fd00::)
    if (lower.startsWith('fc') || lower.startsWith('fd')) {
      return true;
    }

    // Link-Local fe80::/10 (fe8, fe9, fea, feb)
    if (
      lower.startsWith('fe8') ||
      lower.startsWith('fe9') ||
      lower.startsWith('fea') ||
      lower.startsWith('feb')
    ) {
      return true;
    }

    // Multicast ff00::/8
    if (lower.startsWith('ff')) {
      return true;
    }

    return false;
  }

  // Any unrecognized IP string is treated as unsafe
  return true;
}

export type DnsLookupFn = (
  hostname: string,
  options: { all: boolean }
) => Promise<{ address: string; family: number }[]>;

/**
 * Validates a target URL against SSRF vulnerabilities:
 * 1. Scheme must be HTTPS (`https:`)
 * 2. Port must be default 443 (or omit)
 * 3. Username/Password credentials forbidden (`https://user:pass@host`)
 * 4. Hostname resolved via DNS; ALL resolved IPs must be public (non-RFC1918, non-loopback, non-metadata)
 * 5. Returns pinned URL targeting resolved IP address to prevent DNS rebinding TOCTOU attacks.
 */
export async function validateWebhookUrl(
  inputUrl: string,
  dnsResolver: DnsLookupFn = lookup as unknown as DnsLookupFn
): Promise<SsrfValidationResult> {
  let parsed: URL;
  try {
    parsed = new URL(inputUrl);
  } catch {
    return { valid: false, reason: 'Malformed URL' };
  }

  // 1. Enforce HTTPS
  if (parsed.protocol !== 'https:') {
    return { valid: false, reason: 'Only HTTPS URLs are allowed for webhooks' };
  }

  // 2. Reject credentials in URL
  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'URLs containing embedded credentials are not allowed' };
  }

  // 3. Restrict port to 443
  if (parsed.port && parsed.port !== '443') {
    return { valid: false, reason: `Port ${parsed.port} is not allowed. Webhooks must use port 443.` };
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, ''); // strip brackets from IPv6

  // Direct IP check (e.g. https://127.0.0.1 or https://169.254.169.254)
  if (isIP(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      return { valid: false, reason: `Direct connection to private/reserved IP ${hostname} is blocked` };
    }
    return { valid: true, resolvedIps: [hostname], pinnedUrl: parsed.toString() };
  }

  // 4. DNS Resolution & IP classification check
  try {
    const addresses = await dnsResolver(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { valid: false, reason: 'DNS resolution returned no addresses' };
    }

    const resolvedIps = addresses.map((a) => a.address);

    // Verify EVERY resolved IP address is public
    for (const ip of resolvedIps) {
      if (isPrivateOrReservedIp(ip)) {
        return {
          valid: false,
          reason: `Domain ${hostname} resolved to private/reserved IP ${ip}`,
          resolvedIps,
        };
      }
    }

    // 5. DNS Rebinding TOCTOU Defense:
    // Pin the URL directly to the first validated IP address while preserving hostname in Host header
    const targetIp = resolvedIps[0];
    const isV6 = isIP(targetIp) === 6;
    const formattedIpHost = isV6 ? `[${targetIp}]` : targetIp;

    const pinnedUrl = new URL(parsed.toString());
    pinnedUrl.hostname = formattedIpHost;

    return {
      valid: true,
      resolvedIps,
      pinnedUrl: pinnedUrl.toString(),
    };
  } catch (err) {
    return { valid: false, reason: `DNS resolution failed: ${String(err)}` };
  }
}

