import { ZodError } from 'zod';

export function handleActionError(err: unknown, defaultMessage: string): never {
  if (err instanceof ZodError) {
    throw new Error(err.issues[0]?.message ?? defaultMessage);
  }
  if (err instanceof Error) {
    if (
      err.message === 'Unauthorized' ||
      err.message.includes('not found') ||
      err.message.includes('access denied') ||
      err.message.includes('Rate limit') ||
      err.message.includes('does not belong')
    ) {
      throw err;
    }
    console.error(`[Action Error] ${defaultMessage}:`, err);
    throw new Error(err.message || defaultMessage);
  }
  throw new Error(defaultMessage);
}
