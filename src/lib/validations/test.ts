import { z } from 'zod';

export const createTestCaseSchema = z.object({
  promptId: z.string().uuid('Invalid prompt ID'),
  name: z.string().min(1, 'Test case name is required').max(255),
  inputText: z.string().min(1, 'Input text is required'),
  expectedCriteria: z.string().min(1, 'Expected criteria is required'),
});

export const runTestsSchema = z.object({
  versionId: z.string().uuid('Invalid version ID'),
});

export const runComparisonSchema = z.object({
  versionIdA: z.string().uuid('Invalid version ID for A'),
  versionIdB: z.string().uuid('Invalid version ID for B'),
});

export const deleteTestCaseSchema = z.object({
  testCaseId: z.string().uuid('Invalid test case ID'),
});
