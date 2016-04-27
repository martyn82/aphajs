
import {AssociationValue} from "../AssociationValue";
import {AssociationValues} from "../AssociationValues";

export type AssociationValueDescriptor = {[key: string]: string};

export namespace AssociationValueDescriptor {
    export function fromValue(value: AssociationValue): AssociationValueDescriptor {
        let descriptor: AssociationValueDescriptor = {};
        descriptor[value.getKey()] = value.getValue();
        return descriptor;
    }

    export function fromValues(values: AssociationValues): AssociationValueDescriptor {
        let descriptor: AssociationValueDescriptor = {};
        values.getArrayCopy().forEach((value: AssociationValue) => {
            descriptor[value.getKey()] = value.getValue();
        });
        return descriptor;
    }
}
