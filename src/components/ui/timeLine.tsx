import React from 'react';
import { cn } from '@/lib/utils';

// --- Data Structure Interface ---
interface TimelineItemData {
  id: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  icon?: React.ReactNode;
  // 可以添加其他字段，例如状态（'completed', 'current'）用于不同样式
}

// --- Timeline Item Props ---
interface TimelineItemProps extends TimelineItemData {
  orientation: 'vertical' | 'horizontal';
  isLast: boolean;
  isFirst?: boolean; // 仅用于水平方向
}

// --- Timeline Item Component ---
const TimelineItem = ({
  orientation,
  isLast,
  // isFirst, // isFirst 暂时不需要在 Item 内部直接使用
  icon,
  title,
  description,
  timestamp,
}: TimelineItemProps) => {
  const isVertical = orientation === 'vertical';

  if (isVertical) {
    return (
      <div className="flex">
        <div className="relative flex flex-col items-center w-4 mr-4">
          {/* 标记 */}
          <div className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-background border border-border">
            {icon ? icon : <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          {/* 连接线 */}
          {!isLast && (
            <div className="mt-1 flex-1 w-px bg-border"/>
          )}
        </div>
        <div className="flex-1 pb-8 space-y-1">
          {title && <div className="font-semibold text-foreground">{title}</div>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
          {timestamp && <div className="text-xs text-muted-foreground">{timestamp}</div>}
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative flex flex-col items-center pt-4 px-2 flex-1">
        <div className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-border">
          {icon ? icon : <div className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <div className="mt-2 p-2 bg-card border rounded shadow-sm min-w-[120px] max-w-[200px] text-center">
          {title && <div className="font-semibold text-card-foreground text-sm">{title}</div>}
          {description && <div className="text-xs text-muted-foreground break-words">{description}</div>}
          {timestamp && <div className="text-xs text-muted-foreground mt-1">{timestamp}</div>}
        </div>
      </div>
    );
  }
};
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItemData[];
  orientation?: 'vertical' | 'horizontal';
}
const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, orientation = 'vertical', className, ...props }, ref) => {
    const isVertical = orientation === 'vertical';

    if (isVertical) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col', className)}
          {...props}
        >
          {items.map((item, index) => (
            <TimelineItem
              key={item.id}
              orientation={orientation}
              isLast={index === items.length - 1}
              {...item}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div
          ref={ref}
          className={cn('relative w-full pt-4', className)}
          {...props}
        >
           <div className="absolute left-0 right-0 top-[calc(1rem+7px)] h-px bg-border" />

          <div className="flex justify-between">
            {items.map((item, index) => (
              <TimelineItem
                key={item.id}
                orientation={orientation}
                isLast={index === items.length - 1}
                isFirst={index === 0}
                {...item}
              />
            ))}
          </div>
        </div>
      );
    }
  }
);
Timeline.displayName = 'Timeline';

export { Timeline, TimelineItem };
export type { TimelineItemData };