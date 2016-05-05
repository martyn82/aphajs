
import {Exception} from "../../Exception";

export class AggregateNotFoundException extends Exception {
    constructor(aggregateId: string) {
        super(`Aggregate with ID '${aggregateId}' not found.`);
    }
}
