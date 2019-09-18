export = HashSet;
export as namespace HashSet;

declare namespace HashSet { }

declare class HashSet<V> {

    constructor(values?: V[]);

    length: number;

    has(value: V): boolean;

    delete(value: V): boolean;

    forEach(callback: (value: V) => void): void;

    hiveAdd(value: V): boolean;
}
