
import {Event} from "../Message/Event";
import {ScheduleToken} from "./ScheduleToken";

export enum TimeUnit {
    Milliseconds,
    Seconds,
    Minutes,
    Hours
}

export interface EventScheduler {
    cancelSchedule(token: ScheduleToken): void;
    scheduleAt(dateTime: Date, event: Event): ScheduleToken;
    scheduleAfter(timeout: number, event: Event, timeUnit: TimeUnit): ScheduleToken;
}
