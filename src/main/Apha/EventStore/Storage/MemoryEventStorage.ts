
import {EventStorage} from "./EventStorage";
import {EventDescriptor} from "../EventDescriptor";

export class MemoryEventStorage implements EventStorage {
    private data: {[id: string]: EventDescriptor[]} = {};

    public contains(id: string): boolean {
        return typeof this.data[id] !== "undefined";
    }

    public append(event: EventDescriptor): boolean {
        if (!this.contains(event.id)) {
            this.data[event.id] = [];
        }

        this.data[event.id].push(event);
        return true;
    }

    public find(id: string): EventDescriptor[] {
        if (!this.contains(id)) {
            return [];
        }

        return this.data[id];
    }

    public findIdentities(): Set<string> {
        const identities = new Set<string>();
        Object.keys(this.data).forEach(identity => identities.add(identity));
        return identities;
    }

    public clear(): void {
        this.data = {};
    }
}
