
import {Message} from "./Message";

export abstract class Event extends Message {
    private version: number = 0;
    protected id: string;

    public setVersion(version: number): void {
        this.version = version;
    }

    public getVersion(): number {
        return this.version;
    }

    protected setId(id: string): void {
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }
}
