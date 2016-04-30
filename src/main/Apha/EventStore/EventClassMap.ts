
import {Event, EventType} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnknownEventException} from "./UnknownEventException";

export class EventClassMap {
    private classMap: {[eventClass: string]: EventType} = {};

    constructor(eventTypes: EventType[]) {
        eventTypes.forEach((eventType) => {
            this.classMap[ClassNameInflector.className(eventType)] = eventType;
        });
    }

    public getTypeByClassName(eventClass: string): EventType {
        if (!this.classMap[eventClass]) {
            throw new UnknownEventException(eventClass);
        }

        return this.classMap[eventClass];
    }
}
