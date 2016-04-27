
import {AssociationValue} from "./AssociationValue";

export class AssociationValues {
    constructor(private items: AssociationValue[] = []) {}

    public add(item: AssociationValue): void {
        if (this.contains(item)) {
            return;
        }

        this.items.push(item);
    }

    public contains(item: AssociationValue): boolean {
        return this.items.filter((i) => {
                return i === item;
            }).length > 0;
    }

    public size(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items.splice(0, this.items.length);
    }

    public getArrayCopy(): AssociationValue[] {
        return this.items.slice(0, this.items.length);
    }
}
