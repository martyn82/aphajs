
import {TypedEventListener} from "../EventHandling/TypedEventListener";
import {ProjectionStorage} from "./Storage/ProjectionStorage";

export abstract class Projections extends TypedEventListener {
    constructor(protected storage: ProjectionStorage) {
        super();
    }
}
