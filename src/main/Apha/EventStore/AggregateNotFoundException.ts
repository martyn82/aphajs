
import {Exception} from "ts-essentials/target/build/main/lib/Exception";

export class AggregateNotFoundException extends Exception {
    constructor(aggregateId: string) {
        super(`Aggregate with ID '${aggregateId}' not found.`);
    }
}
