import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(255),
});

export const deleteApiKeySchema = z.object({
  id: z.string().uuid(),
});
