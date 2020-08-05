"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * Unlink only change files that are specified in the changes param
 *
 * @param changes existing change files to be removed
 */
function unlinkChangeFiles(changeSet, packageInfos, cwd) {
    const changePath = paths_1.getChangePath(cwd);
    if (!changePath || !changeSet) {
        return;
    }
    console.log('Removing change files:');
    for (let [changeFile, change] of changeSet) {
        if (changeFile && packageInfos[change.packageName] && !packageInfos[change.packageName].private) {
            console.log(`- ${changeFile}`);
            fs_extra_1.default.removeSync(path_1.default.join(changePath, changeFile));
        }
    }
    if (fs_extra_1.default.existsSync(changePath) && fs_extra_1.default.readdirSync(changePath).length === 0) {
        console.log('Removing change path');
        fs_extra_1.default.removeSync(changePath);
    }
}
exports.unlinkChangeFiles = unlinkChangeFiles;
//# sourceMappingURL=unlinkChangeFiles.js.map