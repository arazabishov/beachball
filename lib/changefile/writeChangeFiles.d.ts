import { ChangeFileInfo } from '../types/ChangeInfo';
/**
 * Loops through the `changes` and writes out a list of change files
 * @returns List of changefile paths, mainly for testing purposes.
 */
export declare function writeChangeFiles(changes: {
    [pkgname: string]: ChangeFileInfo;
}, cwd: string): string[];
//# sourceMappingURL=writeChangeFiles.d.ts.map