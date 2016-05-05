
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";

type AnnotatedSagaEnders = string[];

export function SagaEnd(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let enders: AnnotatedSagaEnders = Reflect.getOwnMetadata(MetadataKeys.SAGA_ENDERS, target) || {};
    enders.push(methodName);

    Reflect.defineMetadata(MetadataKeys.SAGA_ENDERS, enders, target);
}
