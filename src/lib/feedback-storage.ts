import { createClient } from '@/lib/supabase/server'
import { Feedback, CreateFeedbackRequest } from '@/types/feedback'

class FeedbackStorage {
  private tableName = 'feedback'
  private bucketName = 'feedback-images'

  async submitFeedback(request: CreateFeedbackRequest): Promise<Feedback | null> {
    try {
      const supabase = await createClient()
      
      let imageUrl: string | null = null

      if (request.image) {
        const uploadResult = await this.uploadImage(request.image)
        if (!uploadResult) {
          throw new Error('图片上传失败')
        }
        imageUrl = uploadResult
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          content: request.content,
          rating: request.rating || null,
          image_url: imageUrl,
          user_email: request.user_email || null,
        })
        .select()
        .single()

      if (error) {
        console.error('保存反馈失败:', error)
        throw error
      }

      return data as Feedback
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      return null
    }
  }

  private async uploadImage(image: File): Promise<string | null> {
    try {
      const supabase = await createClient()
      
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, image, {
          contentType: image.type,
        })

      if (uploadError) {
        console.error('图片上传失败:', uploadError)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(uploadData.path)
      
      return publicUrl
    } catch (error) {
      console.error('Failed to upload image:', error)
      return null
    }
  }

  async getFeedbackList(limit: number = 50): Promise<Feedback[]> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('获取反馈列表失败:', error)
        return []
      }

      return data as Feedback[]
    } catch (error) {
      console.error('Failed to get feedback list:', error)
      return []
    }
  }

  async testConnection(): Promise<{
    success: boolean
    tableExists: boolean
    bucketExists: boolean
    error?: string
  }> {
    try {
      const supabase = await createClient()

      const { error: tableError } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1)

      const tableExists = !tableError

      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      const bucketExists = !bucketsError && buckets?.some(bucket => bucket.name === this.bucketName) || false

      return {
        success: true,
        tableExists,
        bucketExists,
        error: tableError?.message || bucketsError?.message
      }
    } catch (error) {
      return {
        success: false,
        tableExists: false,
        bucketExists: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

export const feedbackStorage = new FeedbackStorage() 