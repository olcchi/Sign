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

    // Get preset from Supabase
    const preset = await supabaseConfigStorage.getPreset(pinCode);

    if (!preset) {
      return NextResponse.json(
        { error: 'PIN码不存在或已过期' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preset,
    });
  } catch (error) {
    console.error('Load preset error:', error);
    return NextResponse.json(
      { error: '加载预设失败' },
      { status: 500 }
    );
  }
} 