"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const git_1 = require("../git");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const getTimeStamp_1 = require("./getTimeStamp");
/**
 * Loops through the `changes` and writes out a list of change files
 * @returns List of changefile paths, mainly for testing purposes.
 */
function writeChangeFiles(changes, cwd) {
    if (Object.keys(changes).length === 0) {
        return [];
    }
    const changePath = paths_1.getChangePath(cwd);
    const branchName = git_1.getBranchName(cwd);
    if (changePath && !fs_extra_1.default.existsSync(changePath)) {
        fs_extra_1.default.mkdirpSync(changePath);
    }
    if (changes && branchName && changePath) {
        const changeFiles = Object.keys(changes).map(pkgName => {
            const suffix = branchName.replace(/[\/\\]/g, '-');
            const prefix = pkgName.replace(/[^a-zA-Z0-9@]/g, '-');
            const fileName = `${prefix}-${getTimeStamp_1.getTimeStamp()}-${suffix}.json`;
            let changeFile = path_1.default.join(changePath, fileName);
            if (fs_extra_1.default.existsSync(changeFile)) {
                const nextFileName = `${prefix}-${getTimeStamp_1.getTimeStamp()}-${suffix}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}.json`;
                changeFile = path_1.default.join(changePath, nextFileName);
            }
            const change = changes[pkgName];
            fs_extra_1.default.writeJSONSync(changeFile, change, { spaces: 2 });
            return changeFile;
        });
        git_1.stageAndCommit(changeFiles, 'Change files', cwd);
        console.log(`git committed these change files:
${changeFiles.map(f => ` - ${f}`).join('\n')}
`);
        return changeFiles;
    }
    return [];
}
exports.writeChangeFiles = writeChangeFiles;
//# sourceMappingURL=writeChangeFiles.js.map