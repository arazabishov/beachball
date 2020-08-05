import { BumpInfo } from '../types/BumpInfo';
import { BeachballOptions } from '../types/BeachballOptions';
import { PackageInfos } from '../types/PackageInfo';
export declare function writePackageJson(modifiedPackages: Set<string>, packageInfos: PackageInfos): void;
/**
 * Performs the bump, writes to the file system
 *
 * deletes change files, update package.json, and changelogs
 */
export declare function performBump(bumpInfo: BumpInfo, options: BeachballOptions): Promise<void>;
//# sourceMappingURL=performBump.d.ts.map