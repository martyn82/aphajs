
import {ScheduleStorage, ScheduledEvent} from "./ScheduleStorage";

export class MemoryScheduleStorage implements ScheduleStorage {
    private data: Map<string, ScheduledEvent>;

    constructor() {
        this.data = new Map<string, ScheduledEvent>();
    }

    public async add(schedule: ScheduledEvent): Promise<void> {
        this.data.set(schedule.token, schedule);
    }

    public async remove(id: string): Promise<void> {
        if (!this.data.has(id)) {
            return;
        }

        this.data.delete(id);
    }

    public async findAll(): Promise<ScheduledEvent[]> {
        const schedule = [];

        for (const event of this.data.values()) {
            schedule.push(event);
        }

        return schedule;
    }
}
