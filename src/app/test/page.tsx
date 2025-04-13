import { Timeline, TimelineItemData } from '@/components/ui/timeLine';


const MyTimelinePage = () => {
  const verticalItems: TimelineItemData[] = [
    { id: 1, title: '1', description: '这是第一个事件的描述。', timestamp: '2024-01-01',  },
    { id: 2, title: '2', description: '当前正在进行的事件。', timestamp: '2024-01-15',  },
    { id: 3, title: '3', description: '未来的事件。', timestamp: '2024-02-01' },
    { id: 4, title: '4', description: '未来的事件。', timestamp: '2024-02-01' },
  ];

  return (
    <div className="p-8 space-y-12">
      <Timeline items={verticalItems} orientation="vertical" />
    </div>
  );
};

export default MyTimelinePage;