
import {EventListener} from "../EventHandling/EventListener";
import {ProjectionStorage} from "./Storage/ProjectionStorage";
import {Projection} from "./Projection";
import {Event} from "../Message/Event";

export abstract class Projections<T extends Projection> implements EventListener {
    constructor(protected storage: ProjectionStorage<T>) {}
    public on: (event: Event) => void;
}
