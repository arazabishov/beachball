export declare class Registry {
    private server?;
    private port?;
    start(): Promise<unknown>;
    private startWithPort;
    stop(): void;
    /**
     * Reset the state of the registry to an empty registry. Starts server if not already started.
     */
    reset(): Promise<void>;
    /**
     * A helper to get registry URL based on currently used port.
     */
    getUrl(): string;
}
//# sourceMappingURL=registry.d.ts.map