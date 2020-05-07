<template>
  <v-content>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar flat color="white">
              <v-btn outlined class="mr-4" @click="setToday">Today</v-btn>
              <v-btn fab text small @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title>{{ title() }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>Day</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = '4day'">
                    <v-list-item-title>4 days</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600">
            <v-calendar
              locale="ja-jp"
              :day-format="timestamp => new Date(timestamp.date).getDate()"
              :month-format="
                timestamp => new Date(timestamp.date).getMonth() + 1 + ' /'
              "
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="'blue'"
              :event-margin-bottom="3"
              :now="today"
              :type="type"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              fluid
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat v-if="selectedEvent">
                <v-toolbar :color="'blue'" dark>
                  <a :href="selectedEvent.event_reference_url" target="_blank" style="color: inherit;"><v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title></a>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <span>{{ selectedEvent.details }}</span>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import {
  ScheduleObject,
  ScheduleObjectSynchronizedLaravelEvents,
  LaravelApiReturnEventsJson
} from "../../vue-data-entity/ScheduleDataObject";
import { Vue, Component, Watch } from "vue-property-decorator";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as Moment from "moment";
import {
  CalendarTimestamp,
  CalendarFormatter,
  CalendarEventParsed,
  CalendarEventVisual,
  CalendarEventColorFunction,
  CalendarEventNameFunction,
  CalendarDaySlotScope,
  CalendarDayBodySlotScope,
  CalendarEventOverlapMode
} from "vuetify/types";
@Component
export default class Information extends Vue {
  private get calendarInstance(): Vue & {
    prev: () => void;
    next: () => void;
    getFormatter: (options: object) => CalendarFormatter;
    checkChange(): () => void;
  } {
    return this.$refs.calendar as Vue & {
      prev: () => void;
      next: () => void;
      getFormatter: (options: object) => CalendarFormatter;
      checkChange(): () => void;
    };
  }

  today: string = Moment().format("YYYY-MM-DD");
  focus: string =  Moment().format("YYYY-MM-DD");
  type: string = "month";
  typeToLabel: object = {
    month: "Month",
    week: "Week",
    day: "Day",
    "4day": "4 Days"
  };
  start: CalendarTimestamp | null = null;
  end: CalendarTimestamp | null = null;
  selectedEvent: ScheduleObjectSynchronizedLaravelEvents | null = null;
  selectedElement: HTMLInputElement | null = null;
  selectedOpen: boolean = false;
  events: Array<ScheduleObjectSynchronizedLaravelEvents> = [];

  public getEvents() {
    Vue.prototype.$http
      .get(`/api/event`)
      .then((res: AxiosResponse<LaravelApiReturnEventsJson>): void => {
        this.events = res.data.data;
        this.events.map(object => {
          return (
            (object.name = object.event_name),
            (object.details = object.event_details),
            (object.start = object.event_closing_day),
            (object.end = object.event_closing_day)
          );
        });
      })
      .catch((error: AxiosError): void => {
        alert("検索実行時にエラーが発生しました");
      });
  }

  public created() {
    this.getEvents();
  }
  public title(): string {
    const { start, end } = this;
    if (!start || !end) {
      return "";
    }

    const startMonth = 1 + Moment(start.date).month();
    const endMonth = 1 + Moment(end.date).month();
    const suffixMonth = startMonth === endMonth ? "" : endMonth;

    const startYear = start.year;
    const endYear = end.year;
    const suffixYear = endYear;

    const startDay = start.day;
    const endDay = end.day;

    switch (this.type) {
      case "month":
        return `${startYear}年${startMonth}月`;
      case "week":
      case "4day":
        return `${startYear}年${startMonth}月${startDay}日 - ${suffixYear}年${suffixMonth}月${endDay}日`;
      case "day":
        return `${startYear}年${startMonth}月${startDay}日`;
    }
    return "";
  }
  monthFormatter(): CalendarFormatter {
    return this.calendarInstance.getFormatter({
      timeZone: "Asia/Tokyo",
      month: "long"
    });
  }

  viewDay({ date }: { date: string }) {
    this.focus = date;
    this.type = "day";
  }

  setToday() {
    this.focus = this.today;
  }
  prev(): void {
    this.calendarInstance.prev();
  }
  next(): void {
    this.calendarInstance.next();
  }
  showEvent({
    nativeEvent,
    event
  }: {
    nativeEvent: HTMLElementEvent<HTMLInputElement>;
    event: ScheduleObjectSynchronizedLaravelEvents;
  }) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => (this.selectedOpen = true), 10);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }
  updateRange({
    start,
    end
  }: {
    start: CalendarTimestamp;
    end: CalendarTimestamp;
  }) {
    this.start = start;
    this.end = end;
  }
  nth(d: number): string {
    return d > 3 && d < 21
      ? "th"
      : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
  }
}

interface HTMLElementEvent<T extends HTMLElement> extends Event {
  target: T;
}
</script>
