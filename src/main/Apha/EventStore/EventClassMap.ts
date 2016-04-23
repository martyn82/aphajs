
import {Event} from "../Message/Event";
import {ClassNameInflector} from "../Inflection/ClassNameInflector";
import {UnknownEventException} from "./UnknownEventException";

export class EventClassMap {
    private classMap: {[eventClass: string]: {new(): Event}} = {};

    constructor(eventClasses: {new(): Event}[]) {
        eventClasses.forEach((eventType) => {
            this.classMap[ClassNameInflector.className(eventType)] = eventType;
        });
    }

    public getTypeByClassName(eventClass: string): {new(): Event} {
        if (!this.classMap[eventClass]) {
            throw new UnknownEventException(eventClass);
        }

        return this.classMap[eventClass];
    }
}
