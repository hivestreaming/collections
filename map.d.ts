export = HashMap;
export as namespace HashMap;

declare namespace HashMap { }

declare class HashMap<K, V> {

    constructor(values?: { [key: string]: V });

    constructor(values?: { [key: number]: V });

    length: number;

    has(key: K): boolean;

    get(key: K): V;

    set(key: K, value: V): void;

    keys(): K[];

    values(): V[];

    entries(): [K, V];

    delete(key: K): boolean;

    forEach(callback: (value: V, key: K) => void): void;

    filter(callback: (value: V, key: K) => boolean): HashMap<K, V>;

    clear(): void;

    map<U>(callback: (value: V, index: number, array: V[]) => U, thisArg?: any): U[];

    concat(map: HashMap<K, V>): HashMap<K, V>;

}
