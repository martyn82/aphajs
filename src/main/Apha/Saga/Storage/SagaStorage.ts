
import {AssociationValueDescriptor} from "./AssociationValueDescriptor";

export interface SagaStorage {
    insert(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): Promise<void>;
    update(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): Promise<void>;
    remove(id: string): Promise<void>;
    findById(id: string): Promise<string>;
    find(sagaClass: string, associationValue: AssociationValueDescriptor): Promise<string[]>;
}
