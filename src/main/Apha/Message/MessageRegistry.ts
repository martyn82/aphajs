
export interface MessageRegistry<T> {
    register: (message: T) => void;
    unregister: (message: T) => void;
    exists: (message: T) => boolean;
    find: (name: string) => T;
    entries: () => IterableIterator<T>;
}
