import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/supabase-storage';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const userAgent = request.headers.get('user-agent');
    if (!userAgent?.includes('vercel-cron/1.0')) {
      console.log('Unauthorized cron request, user-agent:', userAgent);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid user agent' }, 
        { status: 401 }
      );
    }

    console.log('Starting scheduled cleanup of expired presets...');
    
    // Execute cleanup
    const deletedCount = await supabaseConfigStorage.cleanupExpiredPresets();
    
    const result = {
      success: true,
      message: `Successfully cleaned up ${deletedCount} expired presets`,
      deletedCount,
      timestamp: new Date().toISOString(),
      executedBy: 'vercel-cron'
    };

    console.log('Cleanup completed:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron cleanup job failed:', error);
    
    const errorResult = {
      success: false,
      error: 'Cleanup failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      executedBy: 'vercel-cron'
    };
    
    return NextResponse.json(errorResult, { status: 500 });
  }
} 