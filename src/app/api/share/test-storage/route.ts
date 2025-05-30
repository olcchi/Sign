import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Simple test - just try to select from the table without specifying columns
    const { data, error } = await supabase
      .from('shared_presets')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase连接失败',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase连接成功',
      recordCount: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '存储测试失败',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 