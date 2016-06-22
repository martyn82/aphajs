
import {Event} from "../Message/Event";
import {Exception} from "../../Exception";

export type AssertEvents = (expectedEvents: Event[], actualEvents: Event[]) => void;

export class AssertionFailedException extends Exception {
    constructor(message: string) {
        super(message);
    }
}

export function AssertEvents(expectedEvents: Event[], actualEvents: Event[]): void {
    if (
        !isLengthEqual(expectedEvents, actualEvents) ||
        !expectedEvents.every((event, index) => {
            return hasSameIdentifier(event, actualEvents[index]) &&
                hasSameVersion(event, actualEvents[index]) &&
                typeEquals(event, actualEvents[index]);
        })
    ) {
        const expected = "[\n" + expectedEvents.map(event => {
            return "  " + objectToString(event);
        }).join(",\n") + "\n]";

        const actual = "[\n" +  actualEvents.map(event => {
            return "  " + objectToString(event);
        }).join(",\n") + "\n]";

        throw new AssertionFailedException(`\nExpected:\n${expected}\nActual:\n${actual}`);
    }
}

function isLengthEqual(expected: {length: number}, actual: {length: number}): boolean {
    return expected.length === actual.length;
}

function hasSameIdentifier(expected: {id: any}, actual: {id: any}): boolean {
    return expected.id === actual.id;
}

function hasSameVersion(expected: {version: any}, actual: {version: any}): boolean {
    return expected.version === actual.version;
}

function typeEquals(expected: Event, actual: Event): boolean {
    return expected.fullyQualifiedName === actual.fullyQualifiedName;
}

function objectToString(object: Event): string {
    return object.fullyQualifiedName + JSON.stringify(object);
}
