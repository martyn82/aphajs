
import "reflect-metadata";
import {MetadataKeys} from "../../Decorators/MetadataKeys";
import {AnnotatedSaga} from "./AnnotatedSaga";

export type AnnotatedSagaStarters = Set<string>;
export const SAGA_STARTERS = "annotations:sagastarters";

export function StartSaga(
    target: AnnotatedSaga,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>
): void {
    let starters: AnnotatedSagaStarters = Reflect.getOwnMetadata(SAGA_STARTERS, target)
        || new Set<string>();

    starters.add(methodName);
    Reflect.defineMetadata(SAGA_STARTERS, starters, target);
}
