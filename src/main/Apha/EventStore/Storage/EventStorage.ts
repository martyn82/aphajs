
import {EventDescriptor} from "../EventDescriptor";

export interface EventStorage {
    contains(id: string): Promise<boolean>;
    append(event: EventDescriptor): Promise<boolean>;
    find(id: string): Promise<EventDescriptor[]>;
    findIdentities(): Promise<Set<string>>;
    clear(): Promise<void>;
}
