
import "reflect-metadata";
import {MetadataKeys} from "../../Decorators/MetadataKeys";
import {AnnotatedSaga} from "./AnnotatedSaga";

export type AnnotatedSagaEndings = Set<string>;
export const SAGA_ENDINGS = "annotations:sagaendings";

export function EndSaga(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let endings: AnnotatedSagaEndings = Reflect.getOwnMetadata(SAGA_ENDINGS, target) || new Set<string>();

    endings.add(methodName);
    Reflect.defineMetadata(SAGA_ENDINGS, endings, target);
}
