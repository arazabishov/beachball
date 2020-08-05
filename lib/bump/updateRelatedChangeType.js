"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
/**
 * Updates package change types based on dependents (e.g given A -> B, if B has a minor change, A should also have minor change)
 *
 * This function is recursive and will futher call itself to update related dependent packages noting groups and bumpDeps flag
 */
function updateRelatedChangeType(pkgName, changeType, bumpInfo, bumpDeps) {
    var _a, _b;
    const { packageChangeTypes, packageGroups, dependents, packageInfos, dependentChangeTypes, groupOptions } = bumpInfo;
    const disallowedChangeTypes = (_b = (_a = packageInfos[pkgName].options) === null || _a === void 0 ? void 0 : _a.disallowedChangeTypes, (_b !== null && _b !== void 0 ? _b : []));
    let depChangeType = getPackageChangeTypes_1.getMaxChangeType(getPackageChangeTypes_1.MinChangeType, dependentChangeTypes[pkgName], disallowedChangeTypes);
    let dependentPackages = dependents[pkgName];
    // Handle groups
    packageChangeTypes[pkgName] = getPackageChangeTypes_1.getMaxChangeType(changeType, packageChangeTypes[pkgName], disallowedChangeTypes);
    const groupName = packageInfos[pkgName].group;
    if (groupName) {
        let maxGroupChangeType = getPackageChangeTypes_1.MinChangeType;
        // calculate maxChangeType
        packageGroups[groupName].packageNames.forEach(groupPkgName => {
            var _a;
            maxGroupChangeType = getPackageChangeTypes_1.getMaxChangeType(maxGroupChangeType, packageChangeTypes[groupPkgName], (_a = groupOptions[groupName]) === null || _a === void 0 ? void 0 : _a.disallowedChangeTypes);
            // disregard the target disallowed types for now and will be culled at the subsequent update steps
            dependentChangeTypes[groupPkgName] = getPackageChangeTypes_1.getMaxChangeType(depChangeType, dependentChangeTypes[groupPkgName], []);
        });
        packageGroups[groupName].packageNames.forEach(groupPkgName => {
            if (packageChangeTypes[groupPkgName] !== maxGroupChangeType) {
                updateRelatedChangeType(groupPkgName, maxGroupChangeType, bumpInfo, bumpDeps);
            }
        });
    }
    if (bumpDeps && dependentPackages) {
        new Set(dependentPackages).forEach(parent => {
            if (packageChangeTypes[parent] !== depChangeType) {
                // propagate the dependentChangeType of the current package to the subsequent related packages
                dependentChangeTypes[parent] = depChangeType;
                updateRelatedChangeType(parent, depChangeType, bumpInfo, bumpDeps);
            }
        });
    }
}
exports.updateRelatedChangeType = updateRelatedChangeType;
//# sourceMappingURL=updateRelatedChangeType.js.map