
import {Message} from "./Message";

export type EventType = {new(...args: any[]): Event};

export abstract class Event extends Message {
    private _version: number;
    protected _id: string;

    public set version(version: number) {
        this._version = version;
    }

    public get version(): number {
        return this._version;
    }

    public get id(): string {
        return this._id;
    }
}
