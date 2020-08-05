"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setDependentsInBumpInfo_1 = require("./setDependentsInBumpInfo");
const updateRelatedChangeType_1 = require("./updateRelatedChangeType");
const bumpPackageInfoVersion_1 = require("./bumpPackageInfoVersion");
const setGroupsInBumpInfo_1 = require("./setGroupsInBumpInfo");
const setDependentVersions_1 = require("./setDependentVersions");
/**
 * Updates BumpInfo according to change types, bump deps, and version groups
 *
 * NOTE: THIS FUNCTION MUTATES STATE!
 */
function bumpInPlace(bumpInfo, options) {
    const { bumpDeps } = options;
    const { packageInfos, packageChangeTypes, modifiedPackages } = bumpInfo;
    const changes = Object.assign({}, packageChangeTypes);
    // pass 1: figure out all the change types for all the packages taking into account the bumpDeps option and version groups
    if (bumpDeps) {
        setDependentsInBumpInfo_1.setDependentsInBumpInfo(bumpInfo);
    }
    setGroupsInBumpInfo_1.setGroupsInBumpInfo(bumpInfo, options);
    Object.keys(changes).forEach(pkgName => {
        updateRelatedChangeType_1.updateRelatedChangeType(pkgName, changes[pkgName], bumpInfo, bumpDeps);
    });
    // pass 2: actually bump the packages in the bumpInfo in memory (no disk writes at this point)
    Object.keys(packageChangeTypes).forEach(pkgName => {
        bumpPackageInfoVersion_1.bumpPackageInfoVersion(pkgName, bumpInfo);
    });
    // pass 3: Bump all the dependencies packages
    const dependentModifiedPackages = setDependentVersions_1.setDependentVersions(packageInfos);
    dependentModifiedPackages.forEach(pkg => modifiedPackages.add(pkg));
    return bumpInfo;
}
exports.bumpInPlace = bumpInPlace;
//# sourceMappingURL=bumpInPlace.js.map