
export class EventDescriptor {
    constructor(
        public id: string,
        public type: string,
        public event: string,
        public payload: string,
        public recorded: string,
        public version: number
    ) {
    }

    public static record(id: string, type: string, event: string, payload: string, version: number): EventDescriptor {
        return new EventDescriptor(
            id,
            type,
            event,
            payload,
            (new Date()).toUTCString(),
            version
        );
    }
}
