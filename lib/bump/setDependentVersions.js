"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bumpMinSemverRange_1 = require("./bumpMinSemverRange");
function setDependentVersions(packageInfos) {
    const modifiedPackages = new Set();
    Object.keys(packageInfos).forEach(pkgName => {
        const info = packageInfos[pkgName];
        ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depKind => {
            const deps = info[depKind];
            if (deps) {
                Object.keys(deps).forEach(dep => {
                    const packageInfo = packageInfos[dep];
                    if (packageInfo) {
                        const existingVersionRange = deps[dep];
                        const bumpedVersionRange = bumpMinSemverRange_1.bumpMinSemverRange(packageInfo.version, existingVersionRange);
                        if (existingVersionRange !== bumpedVersionRange) {
                            deps[dep] = bumpedVersionRange;
                            modifiedPackages.add(pkgName);
                        }
                    }
                });
            }
        });
    });
    return modifiedPackages;
}
exports.setDependentVersions = setDependentVersions;
//# sourceMappingURL=setDependentVersions.js.map