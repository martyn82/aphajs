
import {Inflect} from "./Inflect";

export abstract class Exception implements Error {
    public name: string;

    constructor(public message?: string) {
        this.name = Inflect.classOf(this);
    }
}
