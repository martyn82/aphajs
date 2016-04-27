
export class AssociationValue {
    constructor(private key: string, private value: string) {}

    public getKey(): string {
        return this.key;
    }

    public getValue(): string {
        return this.value;
    }
}
