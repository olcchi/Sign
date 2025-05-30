import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/supabase-storage';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ pinCode: string }> }
) {
  try {
    const { pinCode } = await context.params;

    if (!pinCode) {
      return NextResponse.json(
        { error: 'PIN码不能为空' },
        { status: 400 }
      );
    }

    // Validate PIN code format
    if (!/^\d{6}$/.test(pinCode)) {
      return NextResponse.json(
        { error: 'PIN码格式无效' },
        { status: 400 }
      );
    }

    // Check if preset exists in Supabase
    const exists = await supabaseConfigStorage.checkPreset(pinCode);

    return NextResponse.json({
      success: true,
      exists,
      message: exists ? 'PIN码存在' : 'PIN码不存在或已过期',
    });
  } catch (error) {
    console.error('Check preset error:', error);
    return NextResponse.json(
      { error: '检查预设失败' },
      { status: 500 }
    );
  }
} 