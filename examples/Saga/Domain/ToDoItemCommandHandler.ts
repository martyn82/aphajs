
import {AnnotatedCommandHandler} from "../../../src/main/Apha/CommandHandling/AnnotatedCommandHandler";
import {EventSourcingRepository} from "../../../src/main/Apha/Repository/EventSourcingRepository";
import {ToDoItem} from "./ToDoItem";
import {CommandHandler} from "../../../src/main/Apha/CommandHandling/CommandHandlerDecorator";

export class ToDoItemCommandHandler extends AnnotatedCommandHandler {
    constructor(private repository: EventSourcingRepository<ToDoItem>) {
        super();
    }

    @CommandHandler()
    public handleCreateToDoItem(command: ToDoItem.Create): void {
        const item = new ToDoItem();
        item.create(command);
        this.repository.store(item, item.version);
    }

    @CommandHandler()
    public handleMarkItemAsDone(command: ToDoItem.MarkAsDone): void {
        const item = this.repository.findById(command.id);
        item.markAsDone(command);
        this.repository.store(item, item.version);
    }

    @CommandHandler()
    public handleExpire(command: ToDoItem.Expire): void {
        const item = this.repository.findById(command.id);
        item.expire(command);
        this.repository.store(item, item.version);
    }
}
