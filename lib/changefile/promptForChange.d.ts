import { ChangeFileInfo } from '../types/ChangeInfo';
import { BeachballOptions } from '../types/BeachballOptions';
/**
 * Uses `prompts` package to prompt for change type and description, fills in git user.email, scope, and the commit hash
 */
export declare function promptForChange(options: BeachballOptions): Promise<{
    [pkgname: string]: ChangeFileInfo;
} | undefined>;
//# sourceMappingURL=promptForChange.d.ts.map