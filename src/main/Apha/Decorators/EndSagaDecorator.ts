
import "reflect-metadata";
import {MetadataKeys} from "./MetadataKeys";
import {AnnotatedSaga} from "../Saga/Annotation/AnnotatedSaga";

export type AnnotatedSagaEndings = Set<string>;

export function EndSaga(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let endings: AnnotatedSagaEndings = Reflect.getOwnMetadata(MetadataKeys.SAGA_ENDINGS, target) || new Set<string>();

    endings.add(methodName);
    Reflect.defineMetadata(MetadataKeys.SAGA_ENDINGS, endings, target);
}
