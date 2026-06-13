import { describe, it, expect } from 'vitest';
import { createPromptSchema, updatePromptSchema, deletePromptSchema } from '../validations/prompt';
import { createApiKeySchema, deleteApiKeySchema } from '../validations/api-key';
import { createVersionSchema, restoreVersionSchema } from '../validations/version';
import {
  createTestCaseSchema,
  runTestsSchema,
  runComparisonSchema,
  deleteTestCaseSchema,
} from '../validations/test';

// RFC 4122 compliant UUID v4 strings (Version digit is 4, variant digit is 8/9/a/b)
const VALID_UUID_1 = '6cf98889-4d6c-4a25-86e6-b4c397fdabcd';
const VALID_UUID_2 = 'a2b2c2d2-e2f2-4242-82b2-c2d2e2f2a2b2';
const VALID_UUID_3 = '12345678-1234-4234-8234-123456789abc';

describe('Validation Schemas', () => {
  describe('Prompt Schemas', () => {
    it('validates correct prompt inputs', () => {
      const valid = { name: 'Customer Agent', description: 'Replies politely' };
      const parsed = createPromptSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('requires name in createPromptSchema (missing name)', () => {
      const invalid = { description: 'No name' };
      const parsed = createPromptSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('expected string');
      }
    });

    it('requires name in createPromptSchema (empty name)', () => {
      const invalid = { name: '', description: 'Empty name' };
      const parsed = createPromptSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toBe('Name is required');
      }
    });

    it('rejects names exceeding 255 chars in createPromptSchema', () => {
      const invalid = { name: 'a'.repeat(256) };
      const parsed = createPromptSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('validates deletePromptSchema with a correct UUID', () => {
      const parsed = deletePromptSchema.safeParse({ promptId: VALID_UUID_1 });
      expect(parsed.success).toBe(true);
    });

    it('rejects deletePromptSchema with an incorrect UUID', () => {
      const parsed = deletePromptSchema.safeParse({ promptId: 'not-a-uuid' });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toBe('Invalid prompt ID');
      }
    });
  });

  describe('API Key Schemas', () => {
    it('validates correct key inputs', () => {
      const valid = { name: 'Prod API Key' };
      const parsed = createApiKeySchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('requires name in createApiKeySchema (missing name)', () => {
      const parsed = createApiKeySchema.safeParse({});
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain('expected string');
      }
    });

    it('requires name in createApiKeySchema (empty name)', () => {
      const parsed = createApiKeySchema.safeParse({ name: '' });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toBe('Key name is required');
      }
    });

    it('validates correct key ID deletion UUID', () => {
      const parsed = deleteApiKeySchema.safeParse({ id: VALID_UUID_2 });
      expect(parsed.success).toBe(true);
    });
  });

  describe('Version Schemas', () => {
    it('validates version creation input', () => {
      const valid = {
        promptId: VALID_UUID_1,
        content: 'System prompt content...',
        commitMessage: 'Improved readability',
      };
      const parsed = createVersionSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('rejects empty content in createVersionSchema', () => {
      const invalid = { promptId: VALID_UUID_1, content: '' };
      const parsed = createVersionSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toBe('Prompt content cannot be empty');
      }
    });

    it('validates restore version input', () => {
      const valid = {
        versionId: VALID_UUID_2,
        promptId: VALID_UUID_1,
      };
      const parsed = restoreVersionSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });
  });

  describe('Test Case Schemas', () => {
    it('validates correct test case creation input', () => {
      const valid = {
        promptId: VALID_UUID_1,
        name: 'Refund check',
        inputText: 'Hello I received a broken cup',
        expectedCriteria: 'Must mention refund options',
      };
      const parsed = createTestCaseSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it('requires inputText and expectedCriteria in createTestCaseSchema', () => {
      const invalid = {
        promptId: VALID_UUID_1,
        name: 'Empty test',
        inputText: '',
        expectedCriteria: '',
      };
      const parsed = createTestCaseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('validates test run and comparisons schemas', () => {
      const runParsed = runTestsSchema.safeParse({
        versionId: VALID_UUID_2,
      });
      expect(runParsed.success).toBe(true);

      const compareParsed = runComparisonSchema.safeParse({
        versionIdA: VALID_UUID_2,
        versionIdB: VALID_UUID_3,
      });
      expect(compareParsed.success).toBe(true);
    });
  });
});
