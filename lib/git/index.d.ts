declare type ProcessOutput = {
    stderr: string;
    stdout: string;
    success: boolean;
};
/**
 * Runs git command - use this for read only commands
 */
export declare function git(args: string[], options?: {
    cwd: string;
}): ProcessOutput;
/**
 * Runs git command - use this for commands that makes changes to the file system
 */
export declare function gitFailFast(args: string[], options?: {
    cwd: string;
}): void;
export declare function getUntrackedChanges(cwd: string): string[] | undefined;
export declare function fetchRemote(remote: string, remoteBranch: string, cwd: string): void;
export declare function getChanges(branch: string, cwd: string): string[] | undefined;
export declare function getChangesBetweenRefs(fromRef: string, toRef: string, options: string[], cwd: string): string[] | undefined;
export declare function getStagedChanges(branch: string, cwd: string): string[] | undefined;
export declare function getRecentCommitMessages(branch: string, cwd: string): string[] | undefined;
export declare function getUserEmail(cwd: string): string | null | undefined;
export declare function getBranchName(cwd: string): string | null;
export declare function getFullBranchRef(branch: string, cwd: string): string | null;
export declare function getShortBranchName(fullBranchRef: string, cwd: string): string | null;
export declare function getCurrentHash(cwd: string): string | null;
/**
 * Get the commit hash in which the file was first added.
 */
export declare function getFileAddedHash(filename: string, cwd: string): string | undefined;
export declare function stageAndCommit(patterns: string[], message: string, cwd: string): void;
export declare function revertLocalChanges(cwd: string): boolean;
export declare function getParentBranch(cwd: string): string | null;
export declare function getRemoteBranch(branch: string, cwd: string): string | null;
export declare function parseRemoteBranch(branch: string): {
    remote: string;
    remoteBranch: string;
};
export declare function getDefaultRemoteBranch(branch: string | undefined, cwd: string): string;
export declare function getDefaultRemote(cwd: string): string;
export declare function listAllTrackedFiles(patterns: string[], cwd: string): string[];
export {};
//# sourceMappingURL=index.d.ts.map