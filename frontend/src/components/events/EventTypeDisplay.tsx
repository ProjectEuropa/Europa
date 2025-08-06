import { type EventType, getEventTypeDisplay } from '@/schemas/event';

interface EventTypeDisplayProps {
  type: EventType;
  className?: string;
}

/**
 * イベントタイプを日本語で表示するコンポーネント
 * 内部値（英語）を表示用の日本語に変換して表示します
 */
export default function EventTypeDisplay({
  type,
  className,
}: EventTypeDisplayProps) {
  return <span className={className}>{getEventTypeDisplay(type)}</span>;
}
