
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class ProjectionNotFoundException extends Exception {
    constructor(id: string) {
        super(`Projection with ID '${id}' not found.`);
    }
}
