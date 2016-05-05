
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";

type AnnotatedSagaStarters = string[];

export function SagaStart(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let starters: AnnotatedSagaStarters = Reflect.getOwnMetadata(MetadataKeys.SAGA_STARTERS, target) || {};
    starters.push(methodName);

    Reflect.defineMetadata(MetadataKeys.SAGA_STARTERS, starters, target);
}
