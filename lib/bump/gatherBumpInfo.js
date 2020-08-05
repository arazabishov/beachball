"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
const readChangeFiles_1 = require("../changefile/readChangeFiles");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const bumpInPlace_1 = require("./bumpInPlace");
const getScopedPackages_1 = require("../monorepo/getScopedPackages");
function gatherPreBumpInfo(options) {
    const { path: cwd } = options;
    // Collate the changes per package
    const changes = readChangeFiles_1.readChangeFiles(options);
    const packageChangeTypes = getPackageChangeTypes_1.getPackageChangeTypes(changes);
    const packageInfos = getPackageInfos_1.getPackageInfos(cwd);
    const dependentChangeTypes = {};
    const groupOptions = {};
    // Clear non-existent changes
    const filteredChanges = new Map();
    for (let [changeFile, change] of changes) {
        if (packageInfos[change.packageName]) {
            filteredChanges.set(changeFile, change);
        }
        dependentChangeTypes[change.packageName] = change.dependentChangeType || 'patch';
    }
    // Clear non-existent changeTypes
    Object.keys(packageChangeTypes).forEach(packageName => {
        if (!packageInfos[packageName]) {
            delete packageChangeTypes[packageName];
        }
    });
    return {
        packageChangeTypes,
        packageInfos,
        packageGroups: {},
        changes: filteredChanges,
        modifiedPackages: new Set(),
        newPackages: new Set(),
        scopedPackages: new Set(getScopedPackages_1.getScopedPackages(options)),
        dependentChangeTypes,
        groupOptions,
        dependents: {},
    };
}
function gatherBumpInfo(options) {
    const bumpInfo = gatherPreBumpInfo(options);
    bumpInPlace_1.bumpInPlace(bumpInfo, options);
    return bumpInfo;
}
exports.gatherBumpInfo = gatherBumpInfo;
//# sourceMappingURL=gatherBumpInfo.js.map