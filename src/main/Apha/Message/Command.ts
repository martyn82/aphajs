
import {Message} from "./Message";

export type CommandType = {new(...args: any[]): Command};

export abstract class Command extends Message {
    protected _id: string;

    public get id(): string {
        return this._id;
    }
}
