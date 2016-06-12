
import {Inflect} from "./Inflect";

export declare class Error {
    name: string;
    message: string;
    stack: string;

    constructor(message?: string);
}

export abstract class Exception extends Error {
    constructor(public message?: string) {
        super(message);
        this.name = Inflect.classOf(this);
    }

    public toString(): string {
        return this.name + ": " + this.message + "\n" + this.stack;
    }
}
