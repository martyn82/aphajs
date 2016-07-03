
import {EventStorage} from "./EventStorage";
import {EventDescriptor} from "../EventDescriptor";

export class MemoryEventStorage implements EventStorage {
    private data: Map<string, EventDescriptor[]> = new Map<string, EventDescriptor[]>();

    public async contains(id: string): Promise<boolean> {
        return this.data.has(id);
    }

    public async append(event: EventDescriptor): Promise<boolean> {
        if (!this.data.has(event.id)) {
            this.data.set(event.id, []);
        }

        this.data.get(event.id).push(event);
        return true;
    }

    public async find(id: string): Promise<EventDescriptor[]> {
        if (!this.data.has(id)) {
            return [];
        }

        return this.data.get(id);
    }

    public async findIdentities(): Promise<Set<string>> {
        const identities = new Set<string>();

        for (const identity of this.data.keys()) {
            identities.add(identity);
        }

        return identities;
    }

    public async clear(): Promise<void> {
        this.data.clear();
    }
}
