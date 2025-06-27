import { createClient } from '@/lib/supabase/server'
import { ShareablePreset } from '@/types'

interface SupabasePreset {
  pin_code: string
  preset_data: ShareablePreset
  created_at: string
  expires_at: string
}

// Supabase storage implementation for shared presets
class SupabaseConfigStorage {
  private tableName = 'shared_presets'

  async setPreset(pinCode: string, preset: ShareablePreset): Promise<boolean> {
    try {
      const supabase = await createClient()

      // Check if preset with this PIN already exists
      const { data: existingPreset, error: selectError } = await supabase
        .from(this.tableName)
        .select('pin_code')
        .eq('pin_code', pinCode)
        .single()

      const presetData: Omit<SupabasePreset, 'created_at'> = {
        pin_code: pinCode,
        preset_data: preset,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }

      let result

      if (existingPreset && !selectError) {
        // Update existing preset
        result = await supabase
          .from(this.tableName)
          .update(presetData)
          .eq('pin_code', pinCode)
      } else {
        // Insert new preset
        result = await supabase
          .from(this.tableName)
          .insert(presetData)
      }

      if (result.error) {
        console.error('Supabase error:', result.error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to save preset to Supabase:', error)
      return false
    }
  }

  async getPreset(pinCode: string): Promise<ShareablePreset | null> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('preset_data, expires_at')
        .eq('pin_code', pinCode)
        .single()

      if (error || !data) {
        return null
      }

      // Check if preset has expired
      if (new Date(data.expires_at) < new Date()) {
        // Clean up expired preset
        await this.deletePreset(pinCode)
        return null
      }

      return data.preset_data as ShareablePreset
    } catch (error) {
      console.error('Failed to get preset from Supabase:', error)
      return null
    }
  }

  async deletePreset(pinCode: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('pin_code', pinCode)

      if (error) {
        console.error('Supabase delete error:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to delete preset from Supabase:', error)
      return false
    }
  }

  async hasPreset(pinCode: string): Promise<boolean> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('pin_code, expires_at')
        .eq('pin_code', pinCode)
        .single()

      if (error || !data) {
        return false
      }

      // Check if preset has expired
      if (new Date(data.expires_at) < new Date()) {
        // Clean up expired preset
        await this.deletePreset(pinCode)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to check preset in Supabase:', error)
      return false
    }
  }

  // Clean up expired presets (utility function)
  async cleanupExpiredPresets(): Promise<number> {
    try {
      const supabase = await createClient()
      
      // Use PostgreSQL's NOW() function for server-side comparison
      const { data, error } = await supabase
        .from(this.tableName)
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('*')

      if (error) {
        console.error('Failed to cleanup expired presets:', error)
        return 0
      }

      const deletedCount = data?.length || 0
      
      return deletedCount
    } catch (error) {
      console.error('Failed to cleanup expired presets:', error)
      return 0
    }
  }
}

export const supabaseConfigStorage = new SupabaseConfigStorage() 