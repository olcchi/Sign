import { NextRequest, NextResponse } from 'next/server';
import { vikaConfigStorage } from '@/lib/vika-storage';

export async function POST(request: NextRequest) {
  try {
    const { pinCode, preset } = await request.json();

    if (!pinCode || !preset) {
      return NextResponse.json(
        { error: 'PIN码和预设数据不能为空' },
        { status: 400 }
      );
    }

    // Validate PIN code format
    if (!/^\d{6}$/.test(pinCode)) {
      return NextResponse.json(
        { error: 'PIN码必须是6位数字' },
        { status: 400 }
      );
    }

    // Store preset in Vika
    const success = await vikaConfigStorage.setPreset(pinCode, preset);

    if (!success) {
      return NextResponse.json(
        { error: '保存预设失败，请重试' },
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
      { error: '保存预设失败' },
      { status: 500 }
    );
  }
} 