import { ChangeSet } from '../types/ChangeInfo';
import { PackageInfo } from '../types/PackageInfo';
/**
 * Unlink only change files that are specified in the changes param
 *
 * @param changes existing change files to be removed
 */
export declare function unlinkChangeFiles(changeSet: ChangeSet, packageInfos: {
    [pkg: string]: PackageInfo;
}, cwd: string): void;
//# sourceMappingURL=unlinkChangeFiles.d.ts.map