declare module "src/main/Inflect" {
    export type AnyType = {
        new (...args: any[]): any;
    };
    export namespace Inflect {
        function classOf(object: Object): string;
        function className(type: AnyType): string;
    }
}
declare module "src/main/Exception" {
    export abstract class Exception implements Error {
        message: string;
        name: string;
        constructor(message?: string);
    }
}
declare module "src/main/Apha/Message/Message" {
    export abstract class Message {
    }
}
declare module "src/main/Apha/Message/Command" {
    import { Message } from "src/main/Apha/Message/Message";
    export type CommandType = {
        new (...args: any[]): Command;
    };
    export abstract class Command extends Message {
    }
}
declare module "src/main/Apha/CommandHandling/CommandHandler" {
    import { Command } from "src/main/Apha/Message/Command";
    export interface CommandHandler {
        handle(command: Command): void;
    }
}
declare module "src/main/Apha/Decorators/MetadataKeys" {
    export namespace MetadataKeys {
        const PROPERTY_TYPE: string;
        const PARAM_TYPES: string;
    }
}
declare module "src/main/Apha/Inflection/InflectionException" {
    import { Exception } from "src/main/Exception";
    export class InflectionException extends Exception {
    }
}
declare module "src/main/Apha/Inflection/ClassNameInflector" {
    import { AnyType } from "src/main/Inflect";
    export class ClassNameInflector {
        static classOf(object: Object): string;
        static className(type: AnyType): string;
    }
}
declare module "src/main/Apha/Decorators/DecoratorException" {
    import { Exception } from "src/main/Exception";
    export class DecoratorException extends Exception {
        constructor(targetClass: string, name: string, decoratorName: string);
    }
}
declare module "src/main/Apha/CommandHandling/UnsupportedCommandException" {
    import { Exception } from "src/main/Exception";
    export class UnsupportedCommandException extends Exception {
        constructor(commandClass: string);
    }
}
declare module "src/main/Apha/CommandHandling/CommandHandlerDecorator" {
    import "reflect-metadata";
    export type AnnotatedCommandHandlers = {
        [commandClass: string]: Function;
    };
    export namespace CommandHandlerDecorator {
        const COMMAND_HANDLERS: string;
    }
    export function CommandHandler(): Function;
    export function CommandHandlerDispatcher(): Function;
}
declare module "src/main/Apha/CommandHandling/AnnotatedCommandHandler" {
    import { CommandHandler } from "src/main/Apha/CommandHandling/CommandHandler";
    import { Command } from "src/main/Apha/Message/Command";
    export abstract class AnnotatedCommandHandler implements CommandHandler {
        handle(command: Command): void;
    }
}
declare module "src/main/Apha/CommandHandling/CommandBus" {
    import { CommandHandler } from "src/main/Apha/CommandHandling/CommandHandler";
    import { Command, CommandType } from "src/main/Apha/Message/Command";
    export abstract class CommandBus {
        abstract registerHandler(commandType: CommandType, handler: CommandHandler): void;
        abstract unregisterHandler(commandType: CommandType): void;
        abstract send(command: Command): void;
    }
}
declare module "src/main/Apha/CommandHandling/CommandHandlerAlreadyExistsException" {
    import { Exception } from "src/main/Exception";
    export class CommandHandlerAlreadyExistsException extends Exception {
        constructor(commandClass: string);
    }
}
declare module "src/main/Apha/CommandHandling/NoCommandHandlerException" {
    import { Exception } from "src/main/Exception";
    export class NoCommandHandlerException extends Exception {
        constructor(commandClass: string);
    }
}
declare module "src/main/Apha/CommandHandling/SimpleCommandBus" {
    import { CommandBus } from "src/main/Apha/CommandHandling/CommandBus";
    import { CommandHandler } from "src/main/Apha/CommandHandling/CommandHandler";
    import { Command, CommandType } from "src/main/Apha/Message/Command";
    export class SimpleCommandBus extends CommandBus {
        private handlers;
        registerHandler(commandType: CommandType, handler: CommandHandler): void;
        unregisterHandler(commandType: CommandType): void;
        send(command: Command): void;
    }
}
declare module "src/main/Apha/CommandHandling/TypedCommandHandler" {
    import { CommandHandler } from "src/main/Apha/CommandHandling/CommandHandler";
    import { Command } from "src/main/Apha/Message/Command";
    export abstract class TypedCommandHandler implements CommandHandler {
        handle(command: Command): void;
        private handleByInflection(command);
    }
}
declare module "src/main/Apha/CommandHandling/Gateway/CommandGateway" {
    import { Command } from "src/main/Apha/Message/Command";
    export interface CommandGateway {
        send(command: Command): void;
    }
}
declare module "src/main/Apha/CommandHandling/Interceptor/CommandDispatchInterceptor" {
    import { Command } from "src/main/Apha/Message/Command";
    export interface CommandDispatchInterceptor {
        onBeforeDispatch(command: Command): void;
        onDispatchSuccessful(command: Command): void;
        onDispatchFailed(command: Command, error: Error): void;
    }
}
declare module "src/main/Apha/CommandHandling/Gateway/DefaultCommandGateway" {
    import { CommandGateway } from "src/main/Apha/CommandHandling/Gateway/CommandGateway";
    import { CommandBus } from "src/main/Apha/CommandHandling/CommandBus";
    import { CommandDispatchInterceptor } from "src/main/Apha/CommandHandling/Interceptor/CommandDispatchInterceptor";
    import { Command } from "src/main/Apha/Message/Command";
    export class DefaultCommandGateway implements CommandGateway {
        private commandBus;
        private interceptors;
        constructor(commandBus: CommandBus, interceptors?: CommandDispatchInterceptor[]);
        send(command: Command): void;
        private notifyBeforeDispatch(command);
        private notifyDispatchSuccessful(command);
        private notifyDispatchFailed(command, error);
    }
}
declare module "src/main/Apha/Domain/AggregateIdentifierDecorator" {
    import "reflect-metadata";
    import { AnyType } from "src/main/Inflect";
    export type AnnotatedAggregateIdentifier = {
        name: string;
        type: AnyType;
    };
    export namespace AggregateIdentifierDecorator {
        const AGGREGATE_IDENTIFIER: string;
    }
    export function AggregateIdentifier(): Function;
}
declare module "src/main/Apha/Message/Event" {
    import { Message } from "src/main/Apha/Message/Message";
    export type EventType = {
        new (...args: any[]): Event;
    };
    export abstract class Event extends Message {
        protected _id: string;
        private _version;
        version: number;
        id: string;
    }
}
declare module "src/main/Apha/Domain/UnsupportedEventException" {
    import { Exception } from "src/main/Exception";
    export class UnsupportedEventException extends Exception {
        constructor(eventClass: string, aggregate: string);
    }
}
declare module "src/main/Apha/Domain/AggregateRoot" {
    import { Event } from "src/main/Apha/Message/Event";
    export type AggregateRootType<T extends AggregateRoot | AggregateRoot> = {
        new (...args: any[]): T;
    };
    export abstract class AggregateRoot {
        private _version;
        private eventLog;
        constructor();
        loadFromHistory(history: Event[]): void;
        abstract getId(): string;
        version: number;
        protected on(event: Event): void;
        private handleByInflection(event);
        protected apply(event: Event, change?: boolean): void;
        getUncommittedChanges(): Event[];
        markChangesCommitted(): void;
    }
}
declare module "src/main/Apha/Domain/AggregateFactory" {
    import { AggregateRoot } from "src/main/Apha/Domain/AggregateRoot";
    import { Event } from "src/main/Apha/Message/Event";
    export interface AggregateFactory<T extends AggregateRoot> {
        createAggregate(events: Event[]): T;
        getAggregateType(): string;
    }
}
declare module "src/main/Apha/Domain/GenericAggregateFactory" {
    import { AggregateFactory } from "src/main/Apha/Domain/AggregateFactory";
    import { Event } from "src/main/Apha/Message/Event";
    import { AggregateRoot, AggregateRootType } from "src/main/Apha/Domain/AggregateRoot";
    export class GenericAggregateFactory<T extends AggregateRoot> implements AggregateFactory<T> {
        private aggregateRootType;
        private aggregateType;
        constructor(aggregateRootType: AggregateRootType<T>);
        createAggregate(events: Event[]): T;
        getAggregateType(): string;
    }
}
declare module "src/main/Apha/Domain/IdentityProvider" {
    export class IdentityProvider {
        static generateNew(): string;
    }
}
declare module "src/main/Apha/EventHandling/EventListener" {
    import { Event } from "src/main/Apha/Message/Event";
    export interface EventListener {
        on(event: Event): void;
    }
}
declare module "src/main/Apha/EventHandling/UnsupportedEventException" {
    import { Exception } from "src/main/Exception";
    export class UnsupportedEventException extends Exception {
        constructor(eventClass: string);
    }
}
declare module "src/main/Apha/EventHandling/EventListenerDecorator" {
    import "reflect-metadata";
    export type AnnotatedEventListeners = {
        [eventClass: string]: Function;
    };
    export namespace EventListenerDecorator {
        const EVENT_HANDLERS: string;
    }
    export function EventListener(): Function;
    export function EventListenerDispatcher(): Function;
}
declare module "src/main/Apha/EventHandling/AnnotatedEventListener" {
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    import { Event } from "src/main/Apha/Message/Event";
    export abstract class AnnotatedEventListener implements EventListener {
        on(event: Event): void;
    }
}
declare module "src/main/Apha/EventHandling/EventBus" {
    import { Event, EventType } from "src/main/Apha/Message/Event";
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    export abstract class EventBus {
        abstract subscribe(listener: EventListener, eventType?: EventType): void;
        abstract unsubscribe(listener: EventListener, eventType: EventType): void;
        abstract publish(event: Event): boolean;
    }
}
declare module "src/main/Apha/EventHandling/SimpleEventBus" {
    import { EventBus } from "src/main/Apha/EventHandling/EventBus";
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    import { Event, EventType } from "src/main/Apha/Message/Event";
    export class SimpleEventBus extends EventBus {
        private static wildcard;
        private listeners;
        subscribe(listener: EventListener, eventType?: EventType): void;
        unsubscribe(listener: EventListener, eventType: EventType): void;
        publish(event: Event): boolean;
        private findListeners(eventClasses);
    }
}
declare module "src/main/Apha/EventHandling/TypedEventListener" {
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    import { Event } from "src/main/Apha/Message/Event";
    export class TypedEventListener implements EventListener {
        on(event: Event): void;
        private handleByInflection(event);
    }
}
declare module "src/main/Apha/EventStore/AggregateNotFoundException" {
    import { Exception } from "src/main/Exception";
    export class AggregateNotFoundException extends Exception {
        constructor(aggregateId: string);
    }
}
declare module "src/main/Apha/EventStore/ConcurrencyException" {
    import { Exception } from "src/main/Exception";
    export class ConcurrencyException extends Exception {
        constructor(expectedPlayhead: number, actualPlayhead: number);
    }
}
declare module "src/main/Apha/EventStore/UnknownEventException" {
    import { Exception } from "src/main/Exception";
    export class UnknownEventException extends Exception {
        constructor(eventClass: string);
    }
}
declare module "src/main/Apha/EventStore/EventClassMap" {
    import { EventType } from "src/main/Apha/Message/Event";
    export class EventClassMap {
        private classMap;
        constructor(eventTypes: EventType[]);
        getTypeByClassName(eventClass: string): EventType;
    }
}
declare module "src/main/Apha/EventStore/EventDescriptor" {
    export class EventDescriptor {
        id: string;
        type: string;
        event: string;
        payload: string;
        recorded: string;
        playhead: number;
        constructor(id: string, type: string, event: string, payload: string, recorded: string, playhead: number);
        static record(id: string, type: string, event: string, payload: string, playhead: number): EventDescriptor;
    }
}
declare module "src/main/Apha/EventStore/Storage/EventStorage" {
    import { EventDescriptor } from "src/main/Apha/EventStore/EventDescriptor";
    export interface EventStorage {
        contains(id: string): boolean;
        append(event: EventDescriptor): boolean;
        find(id: string): EventDescriptor[];
        findIdentities(): string[];
    }
}
declare module "src/main/Apha/Serialization/Serializer" {
    import { AnyType } from "src/main/Inflect";
    export interface Serializer {
        serialize(value: any): string;
        deserialize(data: string, type?: AnyType): any;
    }
}
declare module "src/main/Apha/EventStore/EventStore" {
    import { EventBus } from "src/main/Apha/EventHandling/EventBus";
    import { EventStorage } from "src/main/Apha/EventStore/Storage/EventStorage";
    import { Serializer } from "src/main/Apha/Serialization/Serializer";
    import { Event } from "src/main/Apha/Message/Event";
    import { EventClassMap } from "src/main/Apha/EventStore/EventClassMap";
    export class EventStore {
        private eventBus;
        private storage;
        private serializer;
        private eventClassMap;
        private currents;
        constructor(eventBus: EventBus, storage: EventStorage, serializer: Serializer, eventClassMap: EventClassMap);
        save(aggregateId: string, aggregateType: string, events: Event[], expectedPlayhead: number): void;
        private isValidPlayhead(aggregateId, playhead);
        private saveEvent(aggregateId, aggregateType, event);
        getEventsForAggregate(aggregateId: string): Event[];
        getAggregateIds(): string[];
    }
}
declare module "src/main/Apha/EventStore/Storage/MemoryEventStorage" {
    import { EventStorage } from "src/main/Apha/EventStore/Storage/EventStorage";
    import { EventDescriptor } from "src/main/Apha/EventStore/EventDescriptor";
    export class MemoryEventStorage implements EventStorage {
        private data;
        contains(id: string): boolean;
        append(event: EventDescriptor): boolean;
        find(id: string): EventDescriptor[];
        findIdentities(): string[];
    }
}
declare module "src/main/Apha/Projections/Projection" {
    export abstract class Projection {
    }
}
declare module "src/main/Apha/Projections/Storage/ProjectionStorage" {
    import { Projection } from "src/main/Apha/Projections/Projection";
    export interface ProjectionStorage {
        upsert(id: string, projection: Projection): void;
        remove(id: string): void;
        find(id: string): Projection;
        findAll(offset: number, limit: number): Projection[];
        clear(): void;
        findBy(criteria: {}, offset: number, limit: number): Projection[];
    }
}
declare module "src/main/Apha/Projections/Projections" {
    import { TypedEventListener } from "src/main/Apha/EventHandling/TypedEventListener";
    import { ProjectionStorage } from "src/main/Apha/Projections/Storage/ProjectionStorage";
    export abstract class Projections extends TypedEventListener {
        protected storage: ProjectionStorage;
        constructor(storage: ProjectionStorage);
    }
}
declare module "src/main/Apha/Projections/Storage/ProjectionNotFoundException" {
    import { Exception } from "src/main/Exception";
    export class ProjectionNotFoundException extends Exception {
        constructor(id: string);
    }
}
declare module "src/main/Apha/Projections/Storage/MemoryProjectionStorage" {
    import { ProjectionStorage } from "src/main/Apha/Projections/Storage/ProjectionStorage";
    import { Projection } from "src/main/Apha/Projections/Projection";
    export class MemoryProjectionStorage implements ProjectionStorage {
        private data;
        upsert(id: string, projection: Projection): void;
        remove(id: string): void;
        find(id: string): Projection;
        findAll(offset: number, limit: number): Projection[];
        clear(): void;
        findBy(criteria: {
            [name: string]: string;
        }, offset: number, limit: number): Projection[];
    }
}
declare module "src/main/Apha/Repository/Repository" {
    import { AggregateRoot } from "src/main/Apha/Domain/AggregateRoot";
    export interface Repository<T extends AggregateRoot> {
        findById(id: string): T;
        store(aggregate: AggregateRoot, expectedPlayhead: number): void;
    }
}
declare module "src/main/Apha/Repository/EventSourcingRepository" {
    import { Repository } from "src/main/Apha/Repository/Repository";
    import { AggregateRoot } from "src/main/Apha/Domain/AggregateRoot";
    import { AggregateFactory } from "src/main/Apha/Domain/AggregateFactory";
    import { EventStore } from "src/main/Apha/EventStore/EventStore";
    export class EventSourcingRepository<T extends AggregateRoot> implements Repository<T> {
        private factory;
        private eventStore;
        constructor(factory: AggregateFactory<T>, eventStore: EventStore);
        findById(id: string): T;
        store(aggregate: AggregateRoot, expectedPlayhead: number): void;
    }
}
declare module "src/main/Apha/Saga/AssociationValue" {
    export class AssociationValue {
        private key;
        private value;
        constructor(key: string, value: any);
        getKey(): string;
        getValue(): any;
    }
}
declare module "src/main/Apha/Serialization/SerializerDecorator" {
    import "reflect-metadata";
    import { AnyType } from "src/main/Inflect";
    export type AnnotatedIgnoreSerializationProperties = string[];
    export type SerializableType = {
        primaryType: AnyType;
        secondaryType?: AnyType;
    };
    export type AnnotatedSerializableProperties = {
        [propertyName: string]: SerializableType;
    };
    export type SerializableTypeOptions = {
        genericType?: AnyType;
    };
    export namespace Serializer {
        const IGNORE_SERIALIZATION_PROPERTIES: string;
        const SERIALIZABLE_PROPERTIES: string;
        function Ignore(): Function;
        function Serializable(options?: SerializableTypeOptions): Function;
    }
}
declare module "src/main/Apha/Saga/AssociationValues" {
    import { AssociationValue } from "src/main/Apha/Saga/AssociationValue";
    export class AssociationValues implements Iterable<AssociationValue> {
        private items;
        constructor(items?: AssociationValue[]);
        add(item: AssociationValue): void;
        contains(item: AssociationValue): boolean;
        size(): number;
        clear(): void;
        getArrayCopy(): AssociationValue[];
        [Symbol.iterator](): Iterator<AssociationValue>;
    }
}
declare module "src/main/Apha/Saga/Saga" {
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    import { Event } from "src/main/Apha/Message/Event";
    export type SagaType<T extends Saga | Saga> = {
        new (...args: any[]): T;
    };
    export abstract class Saga implements EventListener {
        private id;
        protected associationValues: AssociationValues;
        constructor(id: string, associationValues: AssociationValues);
        abstract on(event: Event): void;
        abstract isActive(): boolean;
        getAssociationValues(): AssociationValues;
        getId(): string;
    }
}
declare module "src/main/Apha/Saga/SagaFactory" {
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    import { Saga, SagaType } from "src/main/Apha/Saga/Saga";
    export interface SagaFactory<T extends Saga> {
        createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T;
        supports(sagaType: SagaType<T>): boolean;
        hydrate(saga: T): void;
        dehydrate(saga: T): void;
    }
}
declare module "src/main/Apha/Saga/UnsupportedSagaException" {
    import { Exception } from "src/main/Exception";
    export class UnsupportedSagaException extends Exception {
        constructor(sagaClass: string);
    }
}
declare module "src/main/Apha/Saga/GenericSagaFactory" {
    import { Saga, SagaType } from "src/main/Apha/Saga/Saga";
    import { SagaFactory } from "src/main/Apha/Saga/SagaFactory";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export class GenericSagaFactory<T extends Saga> implements SagaFactory<T> {
        createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T;
        supports(sagaType: SagaType<T>): boolean;
        hydrate(saga: T): void;
        dehydrate(saga: T): void;
    }
}
declare module "src/main/Apha/Saga/Storage/AssociationValueDescriptor" {
    import { AssociationValue } from "src/main/Apha/Saga/AssociationValue";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export type AssociationValueDescriptor = {
        [key: string]: string;
    };
    export namespace AssociationValueDescriptor {
        function fromValue(value: AssociationValue): AssociationValueDescriptor;
        function fromValues(values: AssociationValues): AssociationValueDescriptor;
    }
}
declare module "src/main/Apha/Saga/Storage/SagaStorage" {
    import { AssociationValueDescriptor } from "src/main/Apha/Saga/Storage/AssociationValueDescriptor";
    export interface SagaStorage {
        insert(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void;
        update(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void;
        remove(id: string): void;
        findById(id: string): string;
        find(sagaClass: string, associationValue: AssociationValueDescriptor): string[];
    }
}
declare module "src/main/Apha/Saga/SagaSerializer" {
    import { Serializer } from "src/main/Apha/Serialization/Serializer";
    import { SagaFactory } from "src/main/Apha/Saga/SagaFactory";
    import { Saga } from "src/main/Apha/Saga/Saga";
    import { AnyType } from "src/main/Inflect";
    export class SagaSerializer<T extends Saga> implements Serializer {
        private serializer;
        private factory;
        constructor(serializer: Serializer, factory: SagaFactory<T>);
        serialize(value: any): string;
        deserialize(data: string, type?: AnyType): any;
    }
}
declare module "src/main/Apha/Saga/SagaRepository" {
    import { SagaStorage } from "src/main/Apha/Saga/Storage/SagaStorage";
    import { SagaSerializer } from "src/main/Apha/Saga/SagaSerializer";
    import { Saga, SagaType } from "src/main/Apha/Saga/Saga";
    import { AssociationValue } from "src/main/Apha/Saga/AssociationValue";
    export class SagaRepository<T extends Saga> {
        private storage;
        private serializer;
        constructor(storage: SagaStorage, serializer: SagaSerializer<T>);
        add(saga: T): void;
        commit(saga: T): void;
        find(sagaType: SagaType<T>, associationValue: AssociationValue): string[];
        load(id: string, sagaType: SagaType<T>): T;
    }
}
declare module "src/main/Apha/Saga/Annotation/AssociationValueResolver" {
    import { Event } from "src/main/Apha/Message/Event";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export interface AssociationValueResolver {
        extractAssociationValues(event: Event): AssociationValues;
    }
}
declare module "src/main/Apha/Saga/SagaManager" {
    import { EventListener } from "src/main/Apha/EventHandling/EventListener";
    import { Saga, SagaType } from "src/main/Apha/Saga/Saga";
    import { SagaFactory } from "src/main/Apha/Saga/SagaFactory";
    import { SagaRepository } from "src/main/Apha/Saga/SagaRepository";
    import { Event } from "src/main/Apha/Message/Event";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    import { AssociationValueResolver } from "src/main/Apha/Saga/Annotation/AssociationValueResolver";
    export enum SagaCreationPolicy {
        Never = 0,
        IFNoneFound = 1,
        Always = 2,
    }
    export abstract class SagaManager<T extends Saga> implements EventListener {
        private sagaTypes;
        private repository;
        private associationValueResolver;
        private factory;
        constructor(sagaTypes: SagaType<T>[], repository: SagaRepository<T>, associationValueResolver: AssociationValueResolver, factory: SagaFactory<T>);
        on(event: Event): void;
        protected commit(saga: T): void;
        protected getAssociationValueResolver(): AssociationValueResolver;
        protected abstract extractAssociationValues(sagaType: SagaType<T>, event: Event): AssociationValues;
        protected abstract getSagaCreationPolicy(sagaType: SagaType<T>, event: Event): SagaCreationPolicy;
    }
}
declare module "src/main/Apha/Saga/SimpleSagaManager" {
    import { SagaManager, SagaCreationPolicy } from "src/main/Apha/Saga/SagaManager";
    import { Saga, SagaType } from "src/main/Apha/Saga/Saga";
    import { Event } from "src/main/Apha/Message/Event";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export class SimpleSagaManager<T extends Saga> extends SagaManager<T> {
        protected extractAssociationValues(sagaType: SagaType<T>, event: Event): AssociationValues;
        protected getSagaCreationPolicy(sagaType: SagaType<T>, event: Event): SagaCreationPolicy;
    }
}
declare module "src/main/Apha/Saga/Annotation/StartSagaDecorator" {
    import "reflect-metadata";
    export type AnnotatedSagaStarters = Set<string>;
    export namespace StartSagaDecorator {
        const SAGA_STARTERS: string;
    }
    export function StartSaga(): Function;
}
declare module "src/main/Apha/Saga/Annotation/EndSagaDecorator" {
    import "reflect-metadata";
    export type AnnotatedSagaEndings = Set<string>;
    export namespace EndSagaDecorator {
        const SAGA_ENDINGS: string;
    }
    export function EndSaga(): Function;
}
declare module "src/main/Apha/Saga/Annotation/SagaEventHandlerDecorator" {
    import "reflect-metadata";
    export type AnnotatedSagaEventHandlers = {
        [eventClass: string]: [Function, string];
    };
    export type SagaEventHandlerOptions = {
        associationProperty?: string;
    };
    export namespace SagaEventHandlerDecorator {
        const SAGA_EVENT_HANDLERS: string;
    }
    export function SagaEventHandler(options?: SagaEventHandlerOptions): Function;
    export function SagaEventHandlerDispatcher(): Function;
}
declare module "src/main/Apha/Saga/Annotation/ParameterResolver" {
    import { Message } from "src/main/Apha/Message/Message";
    export interface ParameterResolver {
        resolveParameterValue(message: Message, propertyName: string): any;
    }
}
declare module "src/main/Apha/Saga/Annotation/AnnotatedSaga" {
    import { Saga } from "src/main/Apha/Saga/Saga";
    import { Event } from "src/main/Apha/Message/Event";
    import { ParameterResolver } from "src/main/Apha/Saga/Annotation/ParameterResolver";
    import { AssociationValue } from "src/main/Apha/Saga/AssociationValue";
    export abstract class AnnotatedSaga extends Saga {
        private active;
        protected parameterResolver: ParameterResolver;
        constructor(id: string);
        setParameterResolver(parameterResolver: ParameterResolver): void;
        associateWith(associationValue: AssociationValue): void;
        on(event: Event): void;
        isActive(): boolean;
        protected start(): void;
        protected end(): void;
    }
}
declare module "src/main/Apha/Saga/Annotation/AnnotatedSagaFactory" {
    import { SagaFactory } from "src/main/Apha/Saga/SagaFactory";
    import { AnnotatedSaga } from "src/main/Apha/Saga/Annotation/AnnotatedSaga";
    import { ParameterResolver } from "src/main/Apha/Saga/Annotation/ParameterResolver";
    import { SagaType } from "src/main/Apha/Saga/Saga";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export class AnnotatedSagaFactory<T extends AnnotatedSaga | AnnotatedSaga> implements SagaFactory<T> {
        private parameterResolver;
        constructor(parameterResolver: ParameterResolver);
        createSaga(sagaType: SagaType<T>, id: string, associationValues: AssociationValues): T;
        supports(sagaType: SagaType<T>): boolean;
        hydrate(saga: T): void;
        dehydrate(saga: T): void;
    }
}
declare module "src/main/Apha/Saga/Annotation/DefaultParameterResolver" {
    import { ParameterResolver } from "src/main/Apha/Saga/Annotation/ParameterResolver";
    import { Message } from "src/main/Apha/Message/Message";
    export class DefaultParameterResolver implements ParameterResolver {
        resolveParameterValue(message: Message, propertyName: string): any;
    }
}
declare module "src/main/Apha/Saga/Annotation/SimpleAssociationValueResolver" {
    import "reflect-metadata";
    import { AssociationValueResolver } from "src/main/Apha/Saga/Annotation/AssociationValueResolver";
    import { Event } from "src/main/Apha/Message/Event";
    import { AssociationValues } from "src/main/Apha/Saga/AssociationValues";
    export class SimpleAssociationValueResolver implements AssociationValueResolver {
        extractAssociationValues(event: Event): AssociationValues;
    }
}
declare module "src/main/Apha/Saga/Storage/MemorySagaStorage" {
    import { SagaStorage } from "src/main/Apha/Saga/Storage/SagaStorage";
    import { AssociationValueDescriptor } from "src/main/Apha/Saga/Storage/AssociationValueDescriptor";
    export class MemorySagaStorage implements SagaStorage {
        private sagas;
        private associations;
        insert(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void;
        private associateSaga(id, associationValues);
        update(sagaClass: string, id: string, associationValues: AssociationValueDescriptor, data: string): void;
        remove(id: string): void;
        findById(id: string): string;
        find(sagaClass: string, associationValue: AssociationValueDescriptor): string[];
    }
}
declare module "src/main/Apha/Scheduling/ScheduleToken" {
    export class ScheduleToken {
        private value;
        constructor(value: string);
        getToken(): string;
    }
}
declare module "src/main/Apha/Scheduling/EventScheduler" {
    import { Event } from "src/main/Apha/Message/Event";
    import { ScheduleToken } from "src/main/Apha/Scheduling/ScheduleToken";
    export enum TimeUnit {
        Milliseconds = 0,
        Seconds = 1,
        Minutes = 2,
        Hours = 3,
    }
    export interface EventScheduler {
        cancelSchedule(token: ScheduleToken): void;
        scheduleAt(dateTime: Date, event: Event): ScheduleToken;
        scheduleAfter(timeout: number, event: Event, timeUnit: TimeUnit): ScheduleToken;
        destroy(): void;
    }
}
declare module "src/main/Apha/Scheduling/Storage/ScheduleStorage" {
    import { Event } from "src/main/Apha/Message/Event";
    export type ScheduledEvent = {
        token: string;
        timestamp: number;
        event: Event;
    };
    export interface ScheduleStorage {
        add(schedule: ScheduledEvent): void;
        remove(id: string): void;
        findAll(): ScheduledEvent[];
    }
}
declare module "src/main/Apha/Scheduling/SimpleEventScheduler" {
    import { EventScheduler, TimeUnit } from "src/main/Apha/Scheduling/EventScheduler";
    import { ScheduleStorage } from "src/main/Apha/Scheduling/Storage/ScheduleStorage";
    import { EventBus } from "src/main/Apha/EventHandling/EventBus";
    import { ScheduleToken } from "src/main/Apha/Scheduling/ScheduleToken";
    import { Event } from "src/main/Apha/Message/Event";
    export class SimpleEventScheduler implements EventScheduler {
        private storage;
        private eventBus;
        private static MAX_TIMEOUT;
        private static REFRESH_TIMEOUT;
        private refresh;
        private currentSchedule;
        constructor(storage: ScheduleStorage, eventBus: EventBus);
        destroy(): void;
        schedule(): void;
        private scheduleStoredEvents(sender);
        cancelSchedule(token: ScheduleToken): void;
        scheduleAt(dateTime: Date, event: Event): ScheduleToken;
        scheduleAfter(timeout: number, event: Event, timeUnit?: TimeUnit): ScheduleToken;
        private onTimeout(sender, scheduled);
        private toMillis(timeout, unit);
    }
}
declare module "src/main/Apha/Scheduling/Storage/MemoryScheduleStorage" {
    import { ScheduleStorage, ScheduledEvent } from "src/main/Apha/Scheduling/Storage/ScheduleStorage";
    export class MemoryScheduleStorage implements ScheduleStorage {
        private data;
        add(schedule: ScheduledEvent): void;
        remove(id: string): void;
        findAll(): ScheduledEvent[];
    }
}
declare module "src/main/Apha/Serialization/JsonSerializer" {
    import "reflect-metadata";
    import { Serializer } from "src/main/Apha/Serialization/Serializer";
    import { AnyType } from "src/main/Inflect";
    export class JsonSerializer implements Serializer {
        serialize(value: any): string;
        deserialize(data: string, type?: AnyType): any;
        private hydrate(object, data);
        private getSerializableType(target, propertyName);
        private getIgnoredProperties(value);
    }
}
