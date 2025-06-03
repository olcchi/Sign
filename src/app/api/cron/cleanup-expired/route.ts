import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    // Basic security check - verify this is a legitimate cron request
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent.includes('vercel') && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await supabaseConfigStorage.cleanupExpiredPresets();

    return NextResponse.json({
      success: true,
      message: 'Cleanup completed',
      deletedCount: result,
    });
  } catch (error) {
    console.error('Cron cleanup job failed:', error);
    return NextResponse.json(
      { success: false, error: 'Cleanup failed' },
      { status: 500 }
    );
  }
} 