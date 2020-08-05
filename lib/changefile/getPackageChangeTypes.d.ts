import { ChangeSet, ChangeType } from '../types/ChangeInfo';
/**
 * List of all change types from least to most significant.
 */
export declare const SortedChangeTypes: ChangeType[];
/**
 * Change type with the smallest weight.
 */
export declare const MinChangeType: ChangeType;
export declare function getPackageChangeTypes(changeSet: ChangeSet): {
    [pkgName: string]: ChangeType;
};
export declare function isChangeTypeGreater(a: ChangeType, b: ChangeType): boolean;
export declare function getAllowedChangeType(changeType: ChangeType, disallowedChangeTypes: ChangeType[] | null): ChangeType;
export declare function getMaxChangeType(inputA: ChangeType, inputB: ChangeType, disallowedChangeTypes: ChangeType[] | null): ChangeType;
//# sourceMappingURL=getPackageChangeTypes.d.ts.map