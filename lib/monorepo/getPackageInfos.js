"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const git_1 = require("../git");
const infoFromPackageJson_1 = require("./infoFromPackageJson");
function getPackageInfos(cwd) {
    const gitRoot = paths_1.findGitRoot(cwd);
    const packageJsonFiles = git_1.listAllTrackedFiles(['**/package.json', 'package.json'], gitRoot);
    const packageInfos = {};
    if (packageJsonFiles && packageJsonFiles.length > 0) {
        packageJsonFiles.forEach(packageJsonPath => {
            try {
                const packageJsonFullPath = path_1.default.join(gitRoot, packageJsonPath);
                const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
                packageInfos[packageJson.name] = infoFromPackageJson_1.infoFromPackageJson(packageJson, packageJsonFullPath);
            }
            catch (e) {
                // Pass, the package.json is invalid
                console.warn(`Invalid package.json file detected ${packageJsonPath}: `, e);
            }
        });
    }
    else {
        const packageJsonFullPath = path_1.default.join(gitRoot, paths_1.findPackageRoot(cwd), 'package.json');
        const packageJson = fs_extra_1.default.readJSONSync(packageJsonFullPath);
        packageInfos[packageJson.name] = infoFromPackageJson_1.infoFromPackageJson(packageJson, packageJsonFullPath);
    }
    return packageInfos;
}
exports.getPackageInfos = getPackageInfos;
//# sourceMappingURL=getPackageInfos.js.map