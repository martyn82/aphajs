
import "reflect-metadata";
import {MetadataKeys} from "../../Decorators/MetadataKeys";
import {AnnotatedSaga} from "./AnnotatedSaga";

export type AnnotatedSagaStarters = Set<string>;

export namespace StartSagaDecorator {
    export const SAGA_STARTERS = "annotations:sagastarters";
}

export function StartSaga(): Function {
    return (target: AnnotatedSaga, methodName: string): void => {
        let starters: AnnotatedSagaStarters = Reflect.getOwnMetadata(StartSagaDecorator.SAGA_STARTERS, target)
            || new Set<string>();

        starters.add(methodName);
        Reflect.defineMetadata(StartSagaDecorator.SAGA_STARTERS, starters, target);
    };
}
