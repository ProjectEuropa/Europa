export interface ScheduleObject {
  name: string;
  details?: string;
  start: string;
  end?: string;
}
export interface ScheduleObjectSynchronizedLaravelEvents
  extends ScheduleObject {
  name: string;
  details?: string;
  start: string;
  end?: string;
  url?: String;
  event_closing_day: string;
  event_name: string;
  event_details: string;
  event_displaying_day: string;
  event_reference_url?: string;
}

export interface LaravelApiReturnEventsJson {
  data: Array<ScheduleObjectSynchronizedLaravelEvents>;
}
