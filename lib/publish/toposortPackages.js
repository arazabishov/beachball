"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toposort_1 = __importDefault(require("toposort"));
/**
 * Topological sort the packages based on its dependency graph.
 * Dependency comes first before dependent.
 * @param packages Packages to be sorted.
 * @param packageInfos PackagesInfos for the sorted packages.
 */
function toposortPackages(packages, packageInfos) {
    var _a;
    const packageSet = new Set(packages);
    const dependencyGraph = [];
    packages.forEach(pkgName => {
        let allDeps = [];
        ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depKind => {
            const info = packageInfos[pkgName];
            if (!info) {
                throw new Error(`Package info is missing for ${pkgName}.`);
            }
            const deps = info[depKind];
            if (deps) {
                const depPkgNames = Object.keys(deps);
                allDeps = allDeps.concat(depPkgNames);
            }
        });
        allDeps = [...new Set(allDeps)].filter(pkg => packageSet.has(pkg));
        if (allDeps.length > 0) {
            allDeps.forEach(depPkgName => {
                dependencyGraph.push([depPkgName, pkgName]);
            });
        }
        else {
            dependencyGraph.push([undefined, pkgName]);
        }
    });
    try {
        return toposort_1.default(dependencyGraph).filter((pkg) => !!pkg);
    }
    catch (err) {
        throw new Error(`Failed to do toposort for packages: ${(_a = err) === null || _a === void 0 ? void 0 : _a.message}`);
    }
}
exports.toposortPackages = toposortPackages;
//# sourceMappingURL=toposortPackages.js.map