
import {Event} from "../Message/Event";
import {ScheduleToken} from "./ScheduleToken";

export enum TimeUnit {
    Milliseconds,
    Seconds,
    Minutes,
    Hours
}

export interface EventScheduler {
    cancelSchedule(token: ScheduleToken): Promise<void>;
    scheduleAt(dateTime: Date, event: Event): Promise<ScheduleToken>;
    scheduleAfter(timeout: number, event: Event, timeUnit: TimeUnit): Promise<ScheduleToken>;
    destroy(): void;
}
