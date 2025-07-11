import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/preset-storage';

export async function GET(request: NextRequest) {
  try {
    // Security check using CRON_SECRET (recommended by Vercel)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET) {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    } else {
      // Fallback security check - verify this is a legitimate cron request
      const userAgent = request.headers.get('user-agent') || '';
      if (!userAgent.includes('vercel') && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const result = await supabaseConfigStorage.cleanupExpiredPresets();

    console.log(`Cron cleanup completed: ${result} expired presets deleted`);

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