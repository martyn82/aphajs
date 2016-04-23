
import {EventStorage} from "./EventStorage";
import {EventDescriptor} from "../EventDescriptor";

export class MemoryEventStorage implements EventStorage {
    public contains(id: string): boolean {
        return false;
    }

    public append(event: EventDescriptor): boolean {
        return false;
    }

    public find(id: string): EventDescriptor[] {
        return [];
    }

    public findIdentities(): string[] {
        return [];
    }
}
