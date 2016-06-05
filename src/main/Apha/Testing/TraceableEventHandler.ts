
import {Event} from "../Message/Event";

export interface TraceableEventHandler {
    getEvents(): Event[];
    clearTraceLog(): void;
}
