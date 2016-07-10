
import {EventScheduler, TimeUnit} from "./EventScheduler";
import {ScheduleStorage, ScheduledEvent} from "./Storage/ScheduleStorage";
import {EventBus} from "../EventHandling/EventBus";
import {ScheduleToken} from "./ScheduleToken";
import {Event} from "../Message/Event";
import {IdentityProvider} from "../Domain/IdentityProvider";

type Schedule = Map<string, any>;

export class SimpleEventScheduler implements EventScheduler {
    private static MAX_TIMEOUT = 2147483647;
    private static REFRESH_TIMEOUT = 864000000; // 24 hrs

    private refresh = null;
    private currentSchedule: Schedule = new Map<string, any>();

    constructor(private storage: ScheduleStorage, private eventBus: EventBus) {}

    public destroy() {
        global.clearTimeout(this.refresh);
    }

    public async schedule(): Promise<void> {
        return this.scheduleStoredEvents(this);
    }

    private async scheduleStoredEvents(sender: SimpleEventScheduler): Promise<void> {
        const schedule = await sender.storage.findAll();

        for (const scheduledEvent of schedule) {
            if (sender.currentSchedule.has(scheduledEvent.token)) {
                continue;
            }

            const timeout = scheduledEvent.timestamp - Date.now();
            sender.currentSchedule.set(
                scheduledEvent.token,
                global.setTimeout(sender.onTimeout, timeout, sender, scheduledEvent)
            );
        }

        this.refresh = global.setTimeout(sender.scheduleStoredEvents, SimpleEventScheduler.REFRESH_TIMEOUT, sender);
    }

    public async cancelSchedule(token: ScheduleToken): Promise<void> {
        await this.storage.remove(token.getToken());

        if (this.currentSchedule[token.getToken()]) {
            global.clearTimeout(this.currentSchedule[token.getToken()]);
            this.currentSchedule.delete(token.getToken());
        }
    }

    public async scheduleAt(dateTime: Date, event: Event): Promise<ScheduleToken> {
        const timeout = dateTime.getTime() - Date.now();
        return this.scheduleAfter(timeout, event, TimeUnit.Milliseconds);
    }

    public async scheduleAfter(
        timeout: number,
        event: Event,
        timeUnit: TimeUnit = TimeUnit.Milliseconds
    ): Promise<ScheduleToken> {
        const timeoutMs = this.toMillis(timeout, timeUnit);

        const token = new ScheduleToken(IdentityProvider.generateNew());
        const scheduled = {
            token: token.getToken(),
            event: event,
            timestamp: (Date.now() + timeoutMs)
        };

        await this.storage.add(scheduled);

        if (timeoutMs < 0) {
            await this.onTimeout(this, scheduled);
        }
        else if (timeoutMs < SimpleEventScheduler.MAX_TIMEOUT) {
            this.currentSchedule.set(scheduled.token, global.setTimeout(this.onTimeout, timeoutMs, this, scheduled));
        }

        return token;
    }

    private async onTimeout(sender: SimpleEventScheduler, scheduled: ScheduledEvent): Promise<void> {
        sender.currentSchedule.delete(scheduled.token);
        sender.storage.remove(scheduled.token);
        sender.eventBus.publish(scheduled.event);
    }

    private toMillis(timeout: number, unit: TimeUnit): number {
        switch (unit) {
            case TimeUnit.Hours:
                return timeout * 3600000;

            case TimeUnit.Minutes:
                return timeout * 60000;

            case TimeUnit.Seconds:
                return timeout * 1000;

            case TimeUnit.Milliseconds:
            default:
                return timeout;
        }
    }
}
