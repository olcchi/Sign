import { Preset } from "@/components/ui/settings/Preset/types";
import { ApiResponse } from "@/types";
import { presetToShareable, shareableToPreset } from "@/lib/preset-conversion";
import { requestQueue } from "@/services/request-queue";
import { getExpirationTime as getExpirationTimeUtil } from "@/lib/utils";

// Unified preset API service
export class PresetApiService {
  // Generate a random 6-digit PIN code
  static generatePinCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Calculate expiration time (24 hours from now)
  static getExpirationTime(): string {
    return getExpirationTimeUtil(24);
  }

  // Create shareable URL for preset
  static createPresetShareUrl(pinCode: string): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/share-preset/${pinCode}`;
  }

  // Validate PIN code format
  static isValidPinCode(pinCode: string): boolean {
    return /^\d{6}$/.test(pinCode);
  }

  // Save shared preset with automatic cleanup
  static async saveSharedPreset(pinCode: string, preset: Preset): Promise<ApiResponse<void>> {
    try {
      const shareablePreset = presetToShareable(preset);

      const response = await requestQueue.add(() =>
        fetch('/api/share/save-preset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinCode, preset: shareablePreset }),
        })
      );

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` };
      }

      const result = await response.json();
      
      if (result.success) {
        // Trigger supplementary cleanup in background
        try {
          fetch('/api/cron/cleanup-expired', { method: 'POST' }).catch(() => {
            // Silent fail for cleanup
          });
        } catch (error) {
          // Silent fail for cleanup
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to save shared preset:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Load shared preset by PIN code
  static async loadSharedPreset(pinCode: string): Promise<ApiResponse<Preset>> {
    if (!this.isValidPinCode(pinCode)) {
      return { success: false, error: 'Invalid PIN code format' };
    }

    try {
      const response = await requestQueue.add(() =>
        fetch(`/api/share/load-preset/${pinCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, error: '预设不存在或已过期' };
        }
        return { success: false, error: `网络错误 ${response.status}` };
      }

      const result = await response.json();
      
      if (result.success && result.preset) {
        // Convert ShareablePreset to Preset using utility function
        const preset = shareableToPreset(result.preset);
        return { success: true, data: preset };
      }
      
      return { success: false, error: result.error || '加载失败' };
    } catch (error) {
      console.error('Failed to load shared preset:', error);
      return { success: false, error: '网络错误' };
    }
  }

  // Delete shared preset by PIN code
  static async deleteSharedPreset(pinCode: string): Promise<ApiResponse<void>> {
    if (!this.isValidPinCode(pinCode)) {
      return { success: false, error: '无效的PIN码格式' };
    }

    try {
      const response = await requestQueue.add(() =>
        fetch(`/api/share/delete-preset/${pinCode}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to delete shared preset:', error);
      return { success: false, error: '网络错误' };
    }
  }

  // Generate PIN code and save preset (convenience method)
  static async sharePreset(preset: Preset): Promise<ApiResponse<{ pinCode: string; shareUrl: string }>> {
    const pinCode = this.generatePinCode();
    const saveResult = await this.saveSharedPreset(pinCode, preset);
    
    if (saveResult.success) {
      const shareUrl = this.createPresetShareUrl(pinCode);
      return { 
        success: true, 
        data: { pinCode, shareUrl } 
      };
    }
    
    return { 
      success: false, 
      error: saveResult.error 
    };
  }
} 