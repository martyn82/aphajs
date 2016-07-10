
import {Event} from "../../Message/Event";

export type ScheduledEvent = {
    token: string,
    timestamp: number,
    event: Event
};

export interface ScheduleStorage {
    add(schedule: ScheduledEvent): Promise<void>;
    remove(id: string): Promise<void>;
    findAll(): Promise<ScheduledEvent[]>;
}
