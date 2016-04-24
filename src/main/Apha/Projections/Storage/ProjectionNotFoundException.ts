
export class ProjectionNotFoundException extends Error {
    constructor(id: string) {
        super(`Projection with ID '${id}' not found.`);
    }
}
