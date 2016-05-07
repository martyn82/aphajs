
export class AssociationValue {
    constructor(private key: string, private value: any) {}

    public getKey(): string {
        return this.key;
    }

    public getValue(): any {
        return this.value;
    }
}
