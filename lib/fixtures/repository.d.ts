export declare const packageJsonFixture: {
    name: string;
    version: string;
};
export declare class RepositoryFactory {
    root?: string;
    /** Cloned child repos, tracked so we can clean them up */
    childRepos: Repository[];
    create(): Promise<void>;
    cloneRepository(): Promise<Repository>;
    cleanUp(): Promise<void>;
}
export declare class Repository {
    origin?: string;
    root?: string;
    initialize(): Promise<void>;
    get rootPath(): string;
    cloneFrom(path: string, originName?: string): Promise<void>;
    /** Commits a change, automatically uses root path, do not pass absolute paths here */
    commitChange(newFilename: string, content?: string): Promise<void>;
    getCurrentHash(): Promise<string>;
    branch(branchName: string): Promise<void>;
    push(remote: string, branch: string): Promise<void>;
    cleanUp(): Promise<void>;
    /**
     * Set to invalid root
     */
    setRemoteUrl(remote: string, remoteUrl: string): Promise<void>;
}
//# sourceMappingURL=repository.d.ts.map