export interface ObjectStorage {
    /**
     * Gets all keys present in storage.
     */
    keys(): string[];

    /**
     * Gets whether the specified key is present in storage.
     */
    has(key: string): boolean;

    /**
     * Restores non-primitive objects from storage.
     *
     * Unlike {@link ObjectStorage.get}, if the same key has been restored before,
     * the previous object will be purged.
     *
     * @param key A key associated to specific data.
     * @param callback Callback to construct result object, receiving deserialized JSON data as the first argument.
     */
    revive<T>(key: string, callback: (data: any) => T): T;

    /**
     * Gets data from the storage.
     * @param key A key associated to specific data.
     */
    get(key: string): any;

    /**
     * Persists data to storage.
     *
     * Objects are serialized to JSON notation, therefore it has the same limitations as {@link JSON.stringify} when
     * storing non-primitive objects. This can partially overcome by having `toJSON` method on objects to serialize
     * as JSON object structures and be later recovered by {@link ObjectStorage.revive}.
     *
     * Circular references are supported and are maintained when deserialized back from storage.
     * On the other hand, certain built-in objects are ignored, such as `Blob` data, DOM elements and the `window` object.
     *
     * @param key A key associated to specific data.
     * @param value Data to be stored.
     */
    set(key: string, value: any): void;

    /**
     * Marks object as dirty and updates backing storage asynchronously.
     *
     * It has no effects for objects not restored by {@link ObjectStorage.get} or {@link ObjectStorage.revive},
     * or persisted by {@link ObjectStorage.set}.
     *
     * @param obj Object needed to have updates persisted.
     */
    persist(obj: any): void;

    /**
     * Marks all living objects as dirty and updates backing storage asynchronously.
     */
    persistAll(): void;

    /**
     * Removes data from storage.
     * @param key A key associated to specific data.
     */
    delete(key: string): void;

    /**
     * Clears all data present in storage.
     */
    clear(): void;
}

/**
 * Creates a storage that enables serializing and deserializing complex object structures.
 * @param key Key used for saving data to backing storage.
 * @see {@link ObjectStorage}.
 */
export function createObjectStorage(storage: Storage, key: string): ObjectStorage;
