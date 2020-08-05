"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("../paths");
const git_1 = require("../git");
function isGitAvailable(cwd) {
    const result = git_1.git(['--version']);
    const gitRoot = paths_1.findGitRoot(cwd);
    return result.success && gitRoot;
}
exports.isGitAvailable = isGitAvailable;
//# sourceMappingURL=isGitAvailable.js.map