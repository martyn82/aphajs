
import {EventDescriptor} from "../EventDescriptor";

export interface EventStorage {
    contains(id: string): boolean;
    append(event: EventDescriptor): boolean;
    find(id: string): EventDescriptor[];
    findIdentities(): Set<string>;
    clear(): void;
}
