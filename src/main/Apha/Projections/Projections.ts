
import {TypedEventListener} from "../EventHandling/TypedEventListener";
import {ProjectionStorage} from "./Storage/ProjectionStorage";
import {Projection} from "./Projection";

export abstract class Projections<T extends Projection> extends TypedEventListener {
    constructor(protected storage: ProjectionStorage<T>) {
        super();
    }
}
