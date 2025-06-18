export type FeedbackRating = 1 | 2 | 3 | 4 | 5

export interface Feedback {
  id: string
  content: string
  rating?: FeedbackRating // 1=angry, 2=frown, 3=meh, 4=smile, 5=laugh
  image_url?: string // 这是上传到 Supabase Storage 后生成的 URL
  user_email?: string
  created_at: string
}

export interface CreateFeedbackRequest {
  content: string
  rating?: FeedbackRating
  image?: File // 用户选择的图片文件
  user_email?: string
} 