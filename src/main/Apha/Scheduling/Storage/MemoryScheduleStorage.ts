
import {ScheduleStorage, ScheduledEvent} from "./ScheduleStorage";

export class MemoryScheduleStorage implements ScheduleStorage {
    private data: {[id: string]: ScheduledEvent} = {};

    public add(schedule: ScheduledEvent): void {
        this.data[schedule.token] = schedule;
    }

    public remove(id: string): void {
        if (!this.data[id]) {
            return;
        }

        delete this.data[id];
    }

    public findAll(): ScheduledEvent[] {
        const schedule = [];

        for (const id in this.data) {
            schedule.push(this.data[id]);
        }

        return schedule;
    }
}
