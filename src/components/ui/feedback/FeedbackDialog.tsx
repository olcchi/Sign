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
import {
  Send,
  Loader2,
  AlertCircle,
  X,
  Image,
  Check,
  Angry,
  Frown,
  Laugh,
  Meh,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/inputs/textarea";
import { Input } from "@/components/ui/inputs/input";
import { FeedbackRating } from "@/types/feedback";

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
        "fixed left-[50%] top-[50%] z-[1001] grid w-3/4 md:w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg",
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

interface FeedbackDialogProps {
  children: React.ReactNode;
  className?: string;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("图片文件不能超过 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("请选择图片文件");
        return;
      }

      setSelectedImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

      if (selectedImage) {
        formData.append("image", selectedImage);
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
      setSelectedImage(null);
      setImagePreview(null);
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
            感谢您的反馈，我们会认真对待每一条反馈
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
                        size='sm'
                        variant='ghost'
                        onClick={() => setRating(item.value)}
                        disabled={isLoading}
                        className={cn(
                        )}
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
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isLoading}
                  />

                  {!selectedImage ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className=""
                    >
                      添加图片
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <img
                          src={imagePreview!}
                          alt="预览"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          disabled={isLoading}
                          className="absolute top-2 right-2"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {selectedImage.name} (
                        {(selectedImage.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="如果您接受回访，请留下邮箱"
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
              <div className="text-center space-y-3 py-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Check
                    size={32}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    感谢您的反馈，我们会认真处理您的建议
                  </h3>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
