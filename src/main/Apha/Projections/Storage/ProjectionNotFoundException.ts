
import {Exception} from "../../../Exception";

export class ProjectionNotFoundException extends Exception {
    constructor(id: string) {
        super(`Projection with ID '${id}' not found.`);
    }
}
