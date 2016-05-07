
import {Event} from "../../Message/Event";

export type ScheduledEvent = {
    token: string,
    timestamp: number,
    event: Event
};

export interface ScheduleStorage {
    add(schedule: ScheduledEvent): void;
    remove(id: string): void;
    findAll(): ScheduledEvent[];
}
