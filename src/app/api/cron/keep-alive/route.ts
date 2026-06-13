import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { prompts } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // 1. Verify cron authorization to prevent public spamming
  const authHeader = req.headers.get('Authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Perform a lightweight query to wake up/keep active the Supabase database connection
    const result = await db.select({ id: prompts.id }).from(prompts).limit(1);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      activeRecordCount: result.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to query database', details: msg },
      { status: 500 }
    );
  }
}
