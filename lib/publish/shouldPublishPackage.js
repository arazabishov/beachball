"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function shouldPublishPackage(bumpInfo, pkgName) {
    const packageInfo = bumpInfo.packageInfos[pkgName];
    const changeType = bumpInfo.packageChangeTypes[pkgName];
    if (changeType === 'none') {
        return {
            publish: false,
            reasonToSkip: `package ${pkgName} has change type as none`,
        };
    }
    if (packageInfo.private) {
        return {
            publish: false,
            reasonToSkip: `package ${pkgName} is private`,
        };
    }
    if (!bumpInfo.scopedPackages.has(pkgName)) {
        return {
            publish: false,
            reasonToSkip: `package ${pkgName} is out-of-scope`,
        };
    }
    return { publish: true };
}
exports.shouldPublishPackage = shouldPublishPackage;
//# sourceMappingURL=shouldPublishPackage.js.map