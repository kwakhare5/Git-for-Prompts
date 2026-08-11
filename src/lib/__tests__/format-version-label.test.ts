import { describe, it, expect } from 'vitest';
import { formatVersionLabel } from '../format-version-label';

describe('formatVersionLabel', () => {
  it('formats version with custom message and default separator', () => {
    const version = { versionNumber: 3, commitMessage: 'Made tone friendlier' };
    expect(formatVersionLabel(version)).toBe('v3 — Made tone friendlier');
  });

  it('formats version with custom message and custom separator', () => {
    const version = { versionNumber: 5, commitMessage: 'Fixed billing query prompt' };
    expect(formatVersionLabel(version, '·')).toBe('v5 · Fixed billing query prompt');
  });

  it('formats version when commit message is missing or null', () => {
    const version1 = { versionNumber: 1, commitMessage: null };
    const version2 = { versionNumber: 2, commitMessage: undefined };
    expect(formatVersionLabel(version1)).toBe('v1');
    expect(formatVersionLabel(version2)).toBe('v2');
  });

  it('strips redundant leading version number prefixes from commit messages', () => {
    const version = { versionNumber: 2, commitMessage: 'v2 - Updated tone and refund instructions' };
    expect(formatVersionLabel(version, '·')).toBe('v2 · Updated tone and refund instructions');
  });
});
