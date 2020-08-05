"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageGroups_1 = require("../monorepo/getPackageGroups");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
function isValidGroupOptions(root, groups) {
    if (!Array.isArray(groups)) {
        return false;
    }
    for (const group of groups) {
        if (!group.include || !group.name) {
            return false;
        }
    }
    const packageInfos = getPackageInfos_1.getPackageInfos(root);
    const packageGroups = getPackageGroups_1.getPackageGroups(packageInfos, root, groups);
    // make sure no disallowed changetype options exist inside an individual package
    for (const grp of Object.keys(packageGroups)) {
        const pkgs = packageGroups[grp].packageNames;
        for (const pkgName of pkgs) {
            if (packageInfos[pkgName].options.disallowedChangeTypes) {
                console.error(`Cannot have a disallowedChangeType inside a package config (${pkgName}) when there is a group defined; use the groups.disallowedChangeTypes instead.`);
                return false;
            }
        }
    }
    return true;
}
exports.isValidGroupOptions = isValidGroupOptions;
//# sourceMappingURL=isValidGroupOptions.js.map