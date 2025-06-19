export type FeedbackRating = 1 | 2 | 3 | 4 | 5

export interface Feedback {
  id: string
  content: string
  rating?: FeedbackRating // 1=angry, 2=frown, 3=meh, 4=smile, 5=laugh
  image_url?: string 
  user_email?: string
  created_at: string
}

export interface ProcessedFeedback extends Omit<Feedback, 'image_url'> {
  image_urls?: string[] 
}

export interface CreateFeedbackRequest {
  content: string
  rating?: FeedbackRating
  images?: File[] 
  user_email?: string
} 