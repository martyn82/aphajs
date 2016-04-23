
export class AggregateNotFoundException extends Error {
    constructor(aggregateId: string) {
        super(`Aggregate with ID '${aggregateId}' not found.`);
    }
}
