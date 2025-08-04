'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TabsProps } from '@/types/ui';

/**
 * タブコンポーネント
 */
export function Tabs({ items, defaultActiveId, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveId || (items.length > 0 ? items[0].id : '')
  );

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-700">
        <div className="flex overflow-x-auto">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                activeTab === item.id
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={item.disabled}
              role="tab"
              aria-selected={activeTab === item.id}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {items.map(item => (
          <div
            key={item.id}
            role="tabpanel"
            aria-labelledby={`tab-${item.id}`}
            id={`tabpanel-${item.id}`}
            className={cn(activeTab === item.id ? 'block' : 'hidden')}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
