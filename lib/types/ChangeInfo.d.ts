export declare type ChangeType = 'prerelease' | 'patch' | 'minor' | 'major' | 'none';
/**
 * Info saved in each change file.
 */
export interface ChangeFileInfo {
    type: ChangeType;
    comment: string;
    packageName: string;
    email: string;
    date: Date;
    dependentChangeType?: ChangeType;
}
/**
 * Info saved in each change file, plus the commit hash.
 */
export interface ChangeInfo extends ChangeFileInfo {
    commit: string;
}
export declare type ChangeSet = Map<string, ChangeInfo>;
//# sourceMappingURL=ChangeInfo.d.ts.map