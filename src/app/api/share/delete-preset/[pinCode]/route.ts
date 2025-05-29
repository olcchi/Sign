import { NextRequest, NextResponse } from 'next/server';
import { vikaConfigStorage } from '@/lib/vika-storage';

export async function DELETE(
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

    // Delete preset from Vika
    const deleted = await vikaConfigStorage.deletePreset(pinCode);

    if (!deleted) {
      return NextResponse.json(
        { error: 'PIN码不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '预设删除成功',
    });
  } catch (error) {
    console.error('Delete preset error:', error);
    return NextResponse.json(
      { error: '删除预设失败' },
      { status: 500 }
    );
  }
} 