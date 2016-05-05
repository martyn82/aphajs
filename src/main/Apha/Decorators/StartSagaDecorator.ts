
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";

export type AnnotatedSagaStarters = Set<string>;

export function StartSaga(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let starters: AnnotatedSagaStarters = Reflect.getOwnMetadata(MetadataKeys.SAGA_STARTERS, target)
        || new Set<string>();

    starters.add(methodName);
    Reflect.defineMetadata(MetadataKeys.SAGA_STARTERS, starters, target);
}
