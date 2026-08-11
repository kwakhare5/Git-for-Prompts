import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(255),
  expiresAt: z.string().datetime().optional().nullable(),
  scopes: z.array(z.enum(['prompts:read', 'prompts:write', 'versions:write'])).optional(),
});

export const deleteApiKeySchema = z.object({
  id: z.string().uuid(),
});
