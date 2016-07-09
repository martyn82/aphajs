/// <reference path="./../typings/index.d.ts" />

// import {MongoClient, MongoError, Db} from "mongodb";
// import {EventDescriptor} from "../src/main/Apha/EventStore/EventDescriptor";
// import {MongoDbEventStorage} from "../src/main/Apha/EventStore/Storage/MongoDbEventStorage";
// import {Demonstration} from "./CommandsEvents/Domain/Demonstration";
// import {JsonSerializer} from "../src/main/Apha/Serialization/JsonSerializer";
//
// MongoClient.connect("mongodb://localhost:27017/aphajs", (error: MongoError, db: Db) => {
//     const collection = db.collection("events");
//     const eventStorage = new MongoDbEventStorage(collection);
//
//     const serializer = new JsonSerializer();
//     const aggregateId = "4325abc2-45fe-2dab-bcde-fe39-bc8d7ef2";
//     const event = new Demonstration.Demonstrated(aggregateId);
//     const descriptor = EventDescriptor.record(
//         aggregateId,
//         "Demonstration",
//         event.fullyQualifiedName,
//         serializer.serialize(event),
//         event.version
//     );
//
//     eventStorage.append(descriptor);
//
//     // db.close();
// });

// abstract class DomainEvent {
//     constructor(protected _id: string) {}
//     public get id(): string {
//         return this._id;
//     }
// }
//
// abstract class DomainCommand {
//     constructor(protected _id: string) {}
//     public get id(): string {
//         return this._id;
//     }
// }
//
// class Aggregate {
//     private id: string;
//     private _event: DomainEvent;
//
//     public get event(): DomainEvent {
//         return this._event;
//     }
//
//     public doSomething(command: Aggregate.DoSomethingCommand): void {
//         this.somethingDone(new Aggregate.SomethingDoneEvent(command.id));
//     }
//
//     public somethingDone(event: Aggregate.SomethingDoneEvent): void {
//         this.id = event.id;
//         this._event = event;
//     }
// }
//
// namespace Aggregate {
//     export class DoSomethingCommand extends DomainCommand {}
//     export class SomethingDoneEvent extends DomainEvent {}
// }
//
// class EventStorage {
//     public data: Map<string, DomainEvent[]> = new Map<string, DomainEvent[]>();
//
//     public async append(event: DomainEvent): Promise<boolean> {
//         console.log("storing");
//
//         if (!this.data.has(event.id)) {
//             this.data.set(event.id, []);
//         }
//
//         this.data.get(event.id).push(event);
//
//         console.log("stored");
//         return true;
//     }
// }
//
// class EventStore {
//     constructor(private storage: EventStorage) {}
//
//     public async save(aggregate: Aggregate): Promise<void> {
//         console.log("saving");
//         await this.storage.append(aggregate.event);
//         console.log("saved");
//     }
// }
//
// class CommandHandler {
//     constructor(private store: EventStore) {}
//
//     public async handle(command: DomainCommand): Promise<void> {
//         console.log("handling");
//         const aggregate = new Aggregate();
//         aggregate.doSomething(command);
//         await this.store.save(aggregate);
//         console.log("handled");
//     }
// }
//
// class CommandBus {
//     constructor(private handler: CommandHandler) {}
//
//     public async send(command: DomainCommand): Promise<void> {
//         console.log("sending");
//         this.handler.handle(command);
//         console.log("sent");
//     }
//
//     public async sendAndWait(command: DomainCommand): Promise<void> {
//         console.log("sending");
//         console.log("waiting");
//         await this.handler.handle(command);
//         console.log("sent");
//     }
// }
//
// async function main() {
//     const storage = new EventStorage();
//     const bus = new CommandBus(new CommandHandler(new EventStore(storage)));
//
//     bus.send(new Aggregate.DoSomethingCommand("foo"));
//     console.log(storage.data);
// }
//
// main();
