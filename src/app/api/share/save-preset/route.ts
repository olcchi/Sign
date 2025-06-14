import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfigStorage } from '@/lib/supabase-storage';
import { PresetApiService } from '@/lib/preset-api';

export async function POST(request: NextRequest) {
  try {
    const { pinCode, preset } = await request.json();

    if (!pinCode || !preset) {
      return NextResponse.json(
        { success: false, error: 'Missing pinCode or preset data' },
        { status: 400 }
      );
    }

    if (!PresetApiService.isValidPinCode(pinCode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN code format' },
        { status: 400 }
      );
    }

    const success = await supabaseConfigStorage.setPreset(pinCode, preset);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Preset saved successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save preset' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Save preset error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 