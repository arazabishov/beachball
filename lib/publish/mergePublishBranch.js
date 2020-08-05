"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("../git");
function mergePublishBranch(publishBranch, branch, message, cwd) {
    let result;
    let mergeSteps = [
        ['add', '.'],
        ['commit', '-m', message],
        ['checkout', branch],
        ['merge', '-X', 'ours', publishBranch],
        ['branch', '-D', publishBranch],
    ];
    for (let index = 0; index < mergeSteps.length; index++) {
        const step = mergeSteps[index];
        result = git_1.git(step, { cwd });
        if (!result.success) {
            console.error(`mergePublishBranch (${index + 1} / ${mergeSteps.length}) - trying to run "git ${step.join(' ')}"`);
            console.error(result.stdout && result.stdout.toString().trim());
            console.error(result.stderr && result.stderr.toString().trim());
            return result;
        }
    }
    return result;
}
exports.mergePublishBranch = mergePublishBranch;
//# sourceMappingURL=mergePublishBranch.js.map