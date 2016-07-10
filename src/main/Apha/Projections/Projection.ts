
import {clone} from "../../Clone";

export type ProjectionType = {new(...args: any[]): Projection};

export abstract class Projection {
    public copy(overrides?: {}): this {
        const projection = clone(this, Reflect.construct(this.constructor, []));

        for (const prop in overrides) {
            if (overrides.hasOwnProperty(prop) && projection.hasOwnProperty(prop)) {
                projection[prop] = overrides[prop];
            }
        }

        return projection;
    }
}
