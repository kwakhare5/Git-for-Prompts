import { NextResponse } from 'next/server';

export interface ApiResponseOptions<T = unknown> {
  data?: T;
  error?: string;
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Standardized API JSON response helper for Git for Prompts REST API v1.
 */
export function apiResponse<T = unknown>({
  data,
  error,
  status = 200,
  headers = {},
}: ApiResponseOptions<T>): NextResponse {
  const payload = error !== undefined
    ? { success: false, error }
    : { success: true, data };

  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
}
