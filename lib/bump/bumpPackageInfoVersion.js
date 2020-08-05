"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
/**
 * Bumps an individual package version based on the change type
 */
function bumpPackageInfoVersion(pkgName, bumpInfo) {
    const { packageChangeTypes, packageInfos, modifiedPackages } = bumpInfo;
    const info = packageInfos[pkgName];
    const changeType = packageChangeTypes[pkgName];
    if (!info) {
        console.log(`Unknown package named "${pkgName}" detected from change files, skipping!`);
        return;
    }
    if (changeType === 'none') {
        console.log(`"${pkgName}" has a "none" change type, no version bump is required.`);
        return;
    }
    if (info.private) {
        console.log(`Skipping bumping private package "${pkgName}"`);
        return;
    }
    if (!info.private) {
        info.version = semver_1.default.inc(info.version, changeType);
        modifiedPackages.add(pkgName);
    }
}
exports.bumpPackageInfoVersion = bumpPackageInfoVersion;
//# sourceMappingURL=bumpPackageInfoVersion.js.map