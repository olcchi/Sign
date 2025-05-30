import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/supabase-storage';

export async function POST(request: NextRequest) {
  try {
    const { pinCode, preset } = await request.json();

    console.log('Save preset API called with:', { pinCode, preset });

    if (!pinCode || !preset) {
      console.log('Missing pinCode or preset data');
      return NextResponse.json(
        { error: 'PIN码和预设数据不能为空' },
        { status: 400 }
      );
    }

    // Validate PIN code format
    if (!/^\d{6}$/.test(pinCode)) {
      console.log('Invalid PIN code format:', pinCode);
      return NextResponse.json(
        { error: 'PIN码必须是6位数字' },
        { status: 400 }
      );
    }

    console.log('Calling supabaseConfigStorage.setPreset...');
    
    // Store preset in Supabase
    const success = await supabaseConfigStorage.setPreset(pinCode, preset);

    console.log('setPreset result:', success);

    if (!success) {
      return NextResponse.json(
        { error: '保存预设失败，请重试', debug: 'setPreset returned false' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '预设保存成功',
      pinCode,
      expiresAt: preset.expiresAt,
    });
  } catch (error) {
    console.error('Save preset error:', error);
    return NextResponse.json(
      { 
        error: '保存预设失败',
        debug: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 