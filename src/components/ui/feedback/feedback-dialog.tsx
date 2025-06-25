"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/layout/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/layout/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/inputs/textarea";
import { Input } from "@/components/ui/inputs/input";
import { FeedbackRating, BaseDialogProps } from "@/types";
import {
  Loader2,
  AlertCircle,
  X,
  Angry,
  Frown,
  Laugh,
  Meh,
  Smile,
  CircleCheck,
  Plus,
} from "lucide-react";
// Create a non-animated version of DialogContent
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[1001] grid w-3/4 md:w-full max-w-lg min-w-fit translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

interface FeedbackDialogProps extends BaseDialogProps {
  // 反馈对话框特有的属性可以在这里添加
}

export default function FeedbackDialog({
  children,
  className,
}: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rating configuration
  const ratingConfig = [
    { value: 5 as FeedbackRating, icon: Laugh, color: "text-green-500" },
    { value: 4 as FeedbackRating, icon: Smile, color: "text-blue-500" },
    { value: 3 as FeedbackRating, icon: Meh, color: "text-yellow-500" },
    { value: 2 as FeedbackRating, icon: Frown, color: "text-orange-500" },
    { value: 1 as FeedbackRating, icon: Angry, color: "text-red-500" },
  ];

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Check if adding these files would exceed the limit
      if (selectedImages.length + newFiles.length > 4) {
        setError(`最多只能添加4张图片，当前已有${selectedImages.length}张`);
        return;
      }

      const validFiles: File[] = [];
      const validPreviews: string[] = [];

      for (const file of newFiles) {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          setError("图片文件不能超过 2MB");
          continue;
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
          setError("请选择图片文件");
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setError(null);
        
        // Create previews for valid files
        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const preview = e.target?.result as string;
            validPreviews.push(preview);
            
            // Update state when all previews are loaded
            if (validPreviews.length === validFiles.length) {
              setSelectedImages(prev => [...prev, ...validFiles]);
              setImagePreviews(prev => [...prev, ...validPreviews]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove selected image by index
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmail(email);

    // Clear email error when user starts typing
    if (emailError) {
      setEmailError(null);
    }

    // Validate email if not empty
    if (email.trim() && !isValidEmail(email.trim())) {
      setEmailError("请输入有效的邮箱地址");
    } else {
      setEmailError(null);
    }
  };

  // Submit feedback
  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("请输入反馈内容");
      return;
    }

    // Validate email if provided
    if (userEmail.trim() && !isValidEmail(userEmail.trim())) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("content", content.trim());

      if (rating) {
        formData.append("rating", rating.toString());
      }

      if (userEmail.trim()) {
        formData.append("user_email", userEmail.trim());
      }

      if (selectedImages.length > 0) {
        selectedImages.forEach((image, index) => {
          formData.append(`image_${index}`, image);
        });
      }

      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);

        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        const errorMsg = result.details
          ? `${result.error}: ${result.details}`
          : result.error || "提交失败，请重试";
        setError(errorMsg);
        console.error("反馈提交失败:", result);
      }
    } catch (err) {
      setError("网络错误，请检查连接后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setContent("");
      setRating(null);
      setUserEmail("");
      setSelectedImages([]);
      setImagePreviews([]);
      setIsSuccess(false);
      setError(null);
      setEmailError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <p className="text-sm font-bold">意见反馈</p>
          </DialogTitle>
          <DialogDescription>
           请您提交您遇到的问题或建议
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isSuccess ? (
            <>
              {/* Rating selection */}
              <div className="space-y-3">
                <div className="flex justify-center gap-4">
                  {ratingConfig.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = rating === item.value;
                    return (
                      <Button
                        key={item.value}
                        size="sm"
                        variant="outline"
                        onClick={() => setRating(item.value)}
                        disabled={isLoading}
                        className={cn("p-0")}
                      >
                        <IconComponent
                          size={24}
                          className={cn(
                            "transition-colors",
                            isSelected ? item.color : "text-muted-foreground",
                            "hover:" + item.color
                          )}
                        />
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">反馈内容 *</label>
                <Textarea
                  placeholder="请描述您遇到的问题或建议..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] resize-none text-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                  
                  {selectedImages.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      已添加 {selectedImages.length}/4 张图片
                    </p>
                  ):(
                    <p className="text-xs text-muted-foreground">
                      请添加图片
                    </p>
                  )}
                  <div className="flex gap-2">
                    {/* Existing images */}
                    
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imagePreviews[index]}
                          alt={`预览 ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          disabled={isLoading}
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </Button>
                      </div>
                    ))}
                    
                    {/* Add image button - only show if less than 4 images */}
                    {selectedImages.length < 4 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/20 transition-colors"
                      >
                        <Plus size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="请留下您的邮箱，我们会联系您"
                  value={userEmail}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !content.trim() || !!emailError}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>提交反馈</>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center flex flex-col items-center space-y-3 py-6">
                <CircleCheck
                  size={32}
                  className="text-green-600 dark:text-green-400"
                />
                <div>
                  <h2 className="text-sm font-semibold mb-2">
                    我们已经收到了您的反馈，感谢您。
                  </h2>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
