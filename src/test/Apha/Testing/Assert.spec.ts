
import {expect} from "chai";
import {Event} from "../../../main/Apha/Message/Event";
import {AssertEvents, AssertionFailedException} from "../../../main/Apha/Testing/Assert";

describe("Assert", () => {
    describe("AssertEvents", () => {
        it("should pass if expected and actual events are equal", () => {
            const expected = [
                new AssertSpecEvent1(),
                new AssertSpecEvent2()
            ];
            const actual = [
                new AssertSpecEvent1(),
                new AssertSpecEvent2()
            ];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.not.throw(AssertionFailedException);
        });

        it("should throw assertion error if the order of events differs", () => {
            const expected = [
                new AssertSpecEvent1(),
                new AssertSpecEvent2()
            ];
            const actual = [
                new AssertSpecEvent2(),
                new AssertSpecEvent1()
            ];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.throw(AssertionFailedException);
        });

        it("should throw assertion error if the types of events differ", () => {
            const expected = [
                new AssertSpecEvent1()
            ];
            const actual = [
                new AssertSpecEvent2()
            ];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.throw(AssertionFailedException);
        });

        it("should throw assertion error if the length of both event arrays differ", () => {
            const expected = [
                new AssertSpecEvent1(),
                new AssertSpecEvent2()
            ];
            const actual = [
                new AssertSpecEvent1()
            ];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.throw(AssertionFailedException);
        });

        it("should throw assertion error if the identifiers differ", () => {
            const expected = [
                new AssertSpecEvent1("foo")
            ];
            const actual = [
                new AssertSpecEvent1("bar")
            ];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.throw(AssertionFailedException);
        });

        it("should throw assertion error if the versions differ", () => {
            const expectedEvent = new AssertSpecEvent1();
            expectedEvent.version = 1;

            const actualEvent = new AssertSpecEvent1();
            actualEvent.version = 2;

            const expected = [expectedEvent];
            const actual = [actualEvent];

            expect(() => {
                AssertEvents(expected, actual);
            }).to.throw(AssertionFailedException);
        });
    });
});

class AssertSpecEvent1 extends Event {
    constructor(protected _id?: string) {
        super();
    }
}
class AssertSpecEvent2 extends Event {
    constructor(protected _id?: string) {
        super();
    }
}
