import { NextRequest, NextResponse } from 'next/server'
import { feedbackStorage } from '@/lib/feedback-storage'
import { CreateFeedbackRequest, FeedbackRating } from '@/types/feedback'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const content = formData.get('content') as string
    const rating = formData.get('rating') as string | null
    const userEmail = formData.get('user_email') as string | null
    
    // Collect all images (image_0, image_1, image_2, image_3)
    const images: File[] = []
    for (let i = 0; i < 4; i++) {
      const image = formData.get(`image_${i}`) as File | null
      if (image) {
        images.push(image)
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: '反馈内容不能为空' },
        { status: 400 }
      )
    }

    // build request
    const feedbackRequest: CreateFeedbackRequest = {
      content,
      rating: rating ? parseInt(rating) as FeedbackRating : undefined,
      user_email: userEmail || undefined,
      images: images.length > 0 ? images : undefined,
    }

    const result = await feedbackStorage.submitFeedback(feedbackRequest)

    if (!result) {
      return NextResponse.json(
        { error: '提交反馈失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('反馈提交错误:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 