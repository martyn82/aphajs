
import {Message} from "./Message";
import {AggregateIdentifier} from "../Domain/AggregateIdentifierDecorator";

export type EventType = {new(...args: any[]): Event};

export abstract class Event extends Message {
    @AggregateIdentifier()
    protected _id: string;
    private _version: number;

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
