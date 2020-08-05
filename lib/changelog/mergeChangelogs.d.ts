import { PackageChangelog } from '../types/ChangeLog';
import { PackageInfo } from '../types/PackageInfo';
/**
 * Merge multiple PackageChangelog into one.
 * `name`, `date` and `version` will be using the values from master changelog. `comments` are merged.
 */
export declare function mergeChangelogs(changelogs: PackageChangelog[], masterPackage: PackageInfo): PackageChangelog | undefined;
//# sourceMappingURL=mergeChangelogs.d.ts.map