
export class ScheduleToken {
    constructor(private value: string) {}

    public getToken(): string {
        return this.value;
    }
}
