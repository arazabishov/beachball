"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets dependents for all packages
 *
 * Example: "BigApp" deps on "SomeUtil", "BigApp" would be the dependent
 */
function setDependentsInBumpInfo(bumpInfo) {
    const { packageInfos, scopedPackages } = bumpInfo;
    const packages = Object.keys(packageInfos);
    const dependents = {};
    packages.forEach(pkgName => {
        if (!scopedPackages.has(pkgName)) {
            return;
        }
        const info = packageInfos[pkgName];
        const depTypes = ['dependencies', 'devDependencies', 'peerDependencies'];
        depTypes.forEach(depType => {
            const deps = info[depType];
            if (deps) {
                for (let dep of Object.keys(deps)) {
                    if (packages.includes(dep)) {
                        dependents[dep] = dependents[dep] || [];
                        if (!dependents[dep].includes(pkgName)) {
                            dependents[dep].push(pkgName);
                        }
                    }
                }
            }
        });
    });
    bumpInfo.dependents = dependents;
}
exports.setDependentsInBumpInfo = setDependentsInBumpInfo;
//# sourceMappingURL=setDependentsInBumpInfo.js.map