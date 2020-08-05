"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function getPackageGroups(packageInfos, root, groups) {
    const packageGroups = {};
    if (groups) {
        // Check every package to see which group it belongs to
        for (const [pkgName, info] of Object.entries(packageInfos)) {
            const packagePath = path_1.default.dirname(info.packageJsonPath);
            const relativePath = path_1.default.relative(root, packagePath);
            for (const groupOption of groups) {
                if (utils_1.isPathIncluded(relativePath, groupOption.include, groupOption.exclude)) {
                    const groupName = groupOption.name;
                    if (packageInfos[pkgName].group) {
                        console.error(`Error: ${pkgName} cannot belong to multiple groups: [${groupName}, ${packageInfos[pkgName].group}]!`);
                        process.exit(1);
                    }
                    packageInfos[pkgName].group = groupName;
                    if (!packageGroups[groupName]) {
                        packageGroups[groupName] = {
                            packageNames: [],
                            disallowedChangeTypes: groupOption.disallowedChangeTypes,
                        };
                    }
                    packageGroups[groupName].packageNames.push(pkgName);
                }
            }
        }
    }
    return packageGroups;
}
exports.getPackageGroups = getPackageGroups;
//# sourceMappingURL=getPackageGroups.js.map