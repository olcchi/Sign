import { ApiClient } from './api-client';
import { requestQueue } from './request-queue';
import { ShareablePreset, ApiResponse } from '@/types';
import { generatePinCode, isValidPinCode } from '@/lib/share-api';

/**
 * Service for handling preset-related API operations
 */
export class PresetService {
  /**
   * Save a shared preset
   */
  static async saveSharedPreset(
    pinCode: string,
    preset: ShareablePreset
  ): Promise<ApiResponse<void>> {
    return requestQueue.add(() =>
      ApiClient.post<void>('/api/share/save-preset', { pinCode, preset })
    );
  }

  /**
   * Load a shared preset by PIN code
   */
  static async loadSharedPreset(
    pinCode: string
  ): Promise<ApiResponse<ShareablePreset>> {
    if (!isValidPinCode(pinCode)) {
      return {
        success: false,
        error: 'Invalid PIN code format',
      };
    }

    return requestQueue.add(() =>
      ApiClient.get<ShareablePreset>(`/api/share/load-preset/${pinCode}`)
    );
  }

  /**
   * Delete a shared preset by PIN code
   */
  static async deleteSharedPreset(pinCode: string): Promise<ApiResponse<void>> {
    if (!isValidPinCode(pinCode)) {
      return {
        success: false,
        error: 'Invalid PIN code format',
      };
    }

    return requestQueue.add(() =>
      ApiClient.delete<void>(`/api/share/delete-preset/${pinCode}`)
    );
  }

  /**
   * Check if a preset exists
   */
  static async checkPresetExists(pinCode: string): Promise<ApiResponse<boolean>> {
    if (!isValidPinCode(pinCode)) {
      return {
        success: false,
        error: 'Invalid PIN code format',
      };
    }

    return requestQueue.add(() =>
      ApiClient.get<boolean>(`/api/share/check-preset/${pinCode}`)
    );
  }

  /**
   * Generate a new unique PIN code
   */
  static generatePinCode(): string {
    return generatePinCode();
  }
} 