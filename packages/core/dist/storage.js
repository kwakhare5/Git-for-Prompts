/**
 * Storage — adapter interface for prompt persistence.
 *
 * Both the cloud (Drizzle + Postgres) and local (better-sqlite3) storage
 * layers implement this interface. @gfp/core never imports any specific
 * database driver — it only depends on this contract.
 *
 * The eval runner and diff engine consume StorageAdapter to remain
 * fully portable between CLI and Next.js.
 */
export {};
//# sourceMappingURL=storage.js.map