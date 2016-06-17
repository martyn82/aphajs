
import {EventListener} from "../EventHandling/EventListener";
import {ProjectionStorage} from "./Storage/ProjectionStorage";
import {Projection} from "./Projection";
import {Event} from "../Message/Event";

export class ProjectionsType {
    constructor(private _name: string, private _version: number) {}

    public get name(): string {
        return this._name;
    }

    public get version(): number {
        return this._version;
    }
}

export abstract class Projections<T extends Projection> implements EventListener {
    protected _type: ProjectionsType;

    constructor(protected storage: ProjectionStorage<T>, version: number, name: string) {
        this._type = new ProjectionsType(name, version);
    }

    public get type(): ProjectionsType {
        return this._type;
    }

    on: (event: Event) => void;
}
