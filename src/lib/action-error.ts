import { ZodError } from 'zod';

export function handleActionError(err: unknown, defaultMessage: string): never {
  if (err instanceof ZodError) {
    throw new Error(err.issues[0]?.message ?? defaultMessage);
  }
  if (err instanceof Error) {
    throw err;
  }
  throw new Error(defaultMessage);
}
