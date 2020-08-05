"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getScopedPackages_1 = require("../monorepo/getScopedPackages");
const git_1 = require("../git");
function readChangeFiles(options) {
    const { path: cwd } = options;
    const scopedPackages = getScopedPackages_1.getScopedPackages(options);
    const changeSet = new Map();
    const changePath = paths_1.getChangePath(cwd);
    const fromRef = options.fromRef;
    if (!changePath || !fs_extra_1.default.existsSync(changePath)) {
        return changeSet;
    }
    const allChangeFiles = fs_extra_1.default.readdirSync(changePath);
    const filteredChangeFiles = [];
    if (fromRef) {
        const changeFilesSinceFromRef = git_1.getChangesBetweenRefs(fromRef, 'HEAD', [
            '--diff-filter=d',
            '--relative',
        ], changePath);
        allChangeFiles
            .filter(fileName => { var _a; return (_a = changeFilesSinceFromRef) === null || _a === void 0 ? void 0 : _a.includes(fileName); })
            .forEach(fileName => filteredChangeFiles.push(fileName));
    }
    else {
        filteredChangeFiles.push(...allChangeFiles);
    }
    try {
        // sort the change files by modified time. Most recent modified file comes first.
        filteredChangeFiles.sort(function (f1, f2) {
            return (fs_extra_1.default.statSync(path_1.default.join(changePath, f2)).mtime.getTime() - fs_extra_1.default.statSync(path_1.default.join(changePath, f1)).mtime.getTime());
        });
    }
    catch (err) {
        console.warn('Failed to sort change files', err);
    }
    filteredChangeFiles.forEach(changeFile => {
        try {
            const changeFilePath = path_1.default.join(changePath, changeFile);
            const changeInfo = Object.assign(Object.assign({}, fs_extra_1.default.readJSONSync(changeFilePath)), { 
                // Add the commit hash where the file was actually first introduced
                commit: git_1.getFileAddedHash(changeFilePath, cwd) || '' });
            const packageName = changeInfo.packageName;
            if (scopedPackages.includes(packageName)) {
                changeSet.set(changeFile, changeInfo);
            }
            else {
                console.log(`Skipping reading change file for out-of-scope package ${packageName}`);
            }
        }
        catch (e) {
            console.warn(`Invalid change file detected: ${changeFile}`);
        }
    });
    return changeSet;
}
exports.readChangeFiles = readChangeFiles;
//# sourceMappingURL=readChangeFiles.js.map