
import {EventStorage} from "./EventStorage";
import {EventDescriptor} from "../EventDescriptor";

export class MemoryEventStorage implements EventStorage {
    private data: Map<string, EventDescriptor[]> = new Map<string, EventDescriptor[]>();

    public contains(id: string): boolean {
        return this.data.has(id);
    }

    public append(event: EventDescriptor): boolean {
        if (!this.data.has(event.id)) {
            this.data.set(event.id, []);
        }

        this.data.get(event.id).push(event);
        return true;
    }

    public find(id: string): EventDescriptor[] {
        if (!this.data.has(id)) {
            return [];
        }

        return this.data.get(id);
    }

    public findIdentities(): Set<string> {
        const identities = new Set<string>();

        for (const identity of this.data.keys()) {
            identities.add(identity);
        }

        return identities;
    }

    public clear(): void {
        this.data.clear();
    }
}
