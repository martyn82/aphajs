
import {AssociationValue} from "../AssociationValue";
import {AssociationValues} from "../AssociationValues";

export type AssociationValueDescriptor = {[key: string]: string};

export namespace AssociationValueDescriptor {
    export function fromValue(value: AssociationValue): AssociationValueDescriptor {
        const descriptor: AssociationValueDescriptor = {};
        descriptor[value.getKey()] = value.getValue();
        return descriptor;
    }

    export function fromValues(values: AssociationValues): AssociationValueDescriptor {
        const descriptor: AssociationValueDescriptor = {};
        for (const value of values) {
            descriptor[value.getKey()] = value.getValue();
        }
        return descriptor;
    }
}
