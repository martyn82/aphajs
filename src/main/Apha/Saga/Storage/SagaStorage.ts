
import {AssociationValueDescriptor} from "./AssociationValueDescriptor";

export interface SagaStorage {
    insert(sagaClass: string, id: string, associationValues: AssociationValueDescriptor[], data: string): void;
    update(sagaClass: string, id: string, associationValues: AssociationValueDescriptor[], data: string): void;
    remove(id: string): void;
    findById(id: string): string;
    find(sagaClass: string, associationValue: AssociationValueDescriptor): string[];
}
