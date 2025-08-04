/**
 * イベント関連の型定義
 */

import type { DateString, ID } from './utils';
import type { EventType } from '@/schemas/event';

export interface Event {
  id: ID;
  name: string;
  details: string;
  url?: string;
  deadline: DateString;
  endDisplayDate: DateString;
  type: EventType;
  registeredDate?: DateString;
  createdAt?: DateString;
  updatedAt?: DateString;
  isActive?: boolean;
}

export type { EventType } from '@/schemas/event';

export interface EventFormData {
  name: string;
  details: string;
  url?: string;
  deadline: string;
  endDisplayDate: string;
  type: string;
}

export interface EventResponse {
  data: Event[];
}

export interface EventDeleteResponse {
  deleted: boolean;
  error?: string;
}

export interface EventRegistrationData {
  eventName: string;
  eventDetails: string;
  eventReferenceUrl?: string;
  eventClosingDay: string;
  eventDisplayingDay: string;
  eventType: string;
}

export interface MyEventsResponse {
  events: Event[];
}
