
import {EventStore} from "../EventStore/EventStore";
import {TraceableEventHandler} from "./TraceableEventHandler";
import {EventBus} from "../EventHandling/EventBus";
import {EventClassMap} from "../EventStore/EventClassMap";
import {Serializer} from "../Serialization/Serializer";
import {EventStorage} from "../EventStore/Storage/EventStorage";
import {Event} from "../Message/Event";
import {TraceableEventBus} from "./TraceableEventBus";

export class TraceableEventStore extends EventStore implements TraceableEventHandler {
    private traceableEventBus: TraceableEventBus;
    private _storage: EventStorage;

    constructor(
        eventBus: EventBus,
        storage: EventStorage,
        serializer: Serializer,
        eventClassMap: EventClassMap
    ) {
        const traceableEventBus = new TraceableEventBus(eventBus);
        super(traceableEventBus, storage, serializer, eventClassMap);
        this.traceableEventBus = traceableEventBus;
        this._storage = storage;
    }

    public getEvents(): Event[] {
        return this.traceableEventBus.getEvents();
    }

    public clearTraceLog(): void {
        this.traceableEventBus.clearTraceLog();
    }

    public async clear(): Promise<void> {
        return super.clear();
    }
}
