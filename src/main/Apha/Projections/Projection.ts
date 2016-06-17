
import {clone} from "../../Clone";

export abstract class Projection {
    public copy(overrides?: {}): this {
        const proj = clone(this, Reflect.construct(this.constructor, []));

        for (const prop in overrides) {
            if (proj.hasOwnProperty(prop)) {
                proj[prop] = overrides[prop];
            }
        }

        return proj;
    }
}
