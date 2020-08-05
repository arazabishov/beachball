"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../paths");
const git_url_parse_1 = __importDefault(require("git-url-parse"));
/**
 * Runs git command - use this for read only commands
 */
function git(args, options) {
    const results = child_process_1.spawnSync('git', args, options);
    if (results.status === 0) {
        return {
            stderr: results.stderr.toString().trimRight(),
            stdout: results.stdout.toString().trimRight(),
            success: true,
        };
    }
    else {
        return {
            stderr: results.stderr.toString().trimRight(),
            stdout: results.stdout.toString().trimRight(),
            success: false,
        };
    }
}
exports.git = git;
/**
 * Runs git command - use this for commands that makes changes to the file system
 */
function gitFailFast(args, options) {
    const gitResult = git(args, options);
    if (!gitResult.success) {
        console.error(`CRITICAL ERROR: running git command: git ${args.join(' ')}!`);
        console.error(gitResult.stdout && gitResult.stdout.toString().trimRight());
        console.error(gitResult.stderr && gitResult.stderr.toString().trimRight());
        process.exit(1);
    }
}
exports.gitFailFast = gitFailFast;
function getUntrackedChanges(cwd) {
    try {
        const results = git(['status', '-z'], { cwd });
        if (!results.success) {
            return [];
        }
        const changes = results.stdout;
        if (changes.length == 0) {
            return [];
        }
        const lines = changes.split(/\0/).filter(line => line) || [];
        const untracked = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line[0] === ' ' || line[0] === '?') {
                untracked.push(line.substr(3));
            }
            else if (line[0] === 'R') {
                i++;
            }
        }
        return untracked;
    }
    catch (e) {
        console.error('Cannot gather information about changes: ', e.message);
    }
}
exports.getUntrackedChanges = getUntrackedChanges;
function fetchRemote(remote, remoteBranch, cwd) {
    const results = git(['fetch', remote, remoteBranch], { cwd });
    if (!results.success) {
        console.error(`Cannot fetch remote: ${remote}`);
        throw new Error('Cannot fetch');
    }
}
exports.fetchRemote = fetchRemote;
function getChanges(branch, cwd) {
    try {
        return processGitOutput(git(['--no-pager', 'diff', '--name-only', branch + '...'], { cwd }));
    }
    catch (e) {
        console.error('Cannot gather information about changes: ', e.message);
    }
}
exports.getChanges = getChanges;
function getChangesBetweenRefs(fromRef, toRef, options, cwd) {
    try {
        return processGitOutput(git(['--no-pager', 'diff', '--name-only', ...options, fromRef, toRef, '.'], { cwd }));
    }
    catch (e) {
        console.error('Cannot gather information about changes: ', e.message);
    }
}
exports.getChangesBetweenRefs = getChangesBetweenRefs;
function processGitOutput(output) {
    if (!output.success) {
        return [];
    }
    let changes = output.stdout;
    let lines = changes.split(/\n/) || [];
    return lines
        .filter(line => line.trim() !== '')
        .map(line => line.trim())
        .filter(line => !line.includes('node_modules'));
}
function getStagedChanges(branch, cwd) {
    try {
        const results = git(['--no-pager', 'diff', '--staged', '--name-only'], { cwd });
        if (!results.success) {
            return [];
        }
        let changes = results.stdout;
        let lines = changes.split(/\n/) || [];
        return lines
            .filter(line => line.trim() !== '')
            .map(line => line.trim())
            .filter(line => !line.includes('node_modules'));
    }
    catch (e) {
        console.error('Cannot gather information about changes: ', e.message);
    }
}
exports.getStagedChanges = getStagedChanges;
function getRecentCommitMessages(branch, cwd) {
    try {
        const results = git(['log', '--decorate', '--pretty=format:%s', branch, 'HEAD'], { cwd });
        if (!results.success) {
            return [];
        }
        let changes = results.stdout;
        let lines = changes.split(/\n/) || [];
        return lines.map(line => line.trim());
    }
    catch (e) {
        console.error('Cannot gather information about recent commits: ', e.message);
    }
}
exports.getRecentCommitMessages = getRecentCommitMessages;
function getUserEmail(cwd) {
    try {
        const results = git(['config', 'user.email'], { cwd });
        if (!results.success) {
            return null;
        }
        return results.stdout;
    }
    catch (e) {
        console.error('Cannot gather information about user.email: ', e.message);
    }
}
exports.getUserEmail = getUserEmail;
function getBranchName(cwd) {
    try {
        const results = git(['rev-parse', '--abbrev-ref', 'HEAD'], { cwd });
        if (results.success) {
            return results.stdout;
        }
    }
    catch (e) {
        console.error('Cannot get branch name: ', e.message);
    }
    return null;
}
exports.getBranchName = getBranchName;
function getFullBranchRef(branch, cwd) {
    const showRefResults = git(['show-ref', '--heads', branch], { cwd });
    if (showRefResults.success) {
        return showRefResults.stdout.split(' ')[1];
    }
    return null;
}
exports.getFullBranchRef = getFullBranchRef;
function getShortBranchName(fullBranchRef, cwd) {
    const showRefResults = git(['name-rev', '--name-only', fullBranchRef], { cwd });
    if (showRefResults.success) {
        return showRefResults.stdout;
    }
    return null;
}
exports.getShortBranchName = getShortBranchName;
function getCurrentHash(cwd) {
    try {
        const results = git(['rev-parse', 'HEAD'], { cwd });
        if (results.success) {
            return results.stdout;
        }
    }
    catch (e) {
        console.error('Cannot get current git hash');
    }
    return null;
}
exports.getCurrentHash = getCurrentHash;
/**
 * Get the commit hash in which the file was first added.
 */
function getFileAddedHash(filename, cwd) {
    const results = git(['rev-list', 'HEAD', filename], { cwd });
    if (results.success) {
        return results.stdout
            .trim()
            .split('\n')
            .slice(-1)[0];
    }
    return undefined;
}
exports.getFileAddedHash = getFileAddedHash;
function stageAndCommit(patterns, message, cwd) {
    try {
        patterns.forEach(pattern => {
            git(['add', pattern], { cwd });
        });
        const commitResults = git(['commit', '-m', message], { cwd });
        if (!commitResults.success) {
            console.error('Cannot commit changes');
            console.log(commitResults.stdout);
            console.error(commitResults.stderr);
        }
    }
    catch (e) {
        console.error('Cannot stage and commit changes', e.message);
    }
}
exports.stageAndCommit = stageAndCommit;
function revertLocalChanges(cwd) {
    const stash = `beachball_${new Date().getTime()}`;
    git(['stash', 'push', '-u', '-m', stash], { cwd });
    const results = git(['stash', 'list']);
    if (results.success) {
        const lines = results.stdout.split(/\n/);
        const foundLine = lines.find(line => line.includes(stash));
        if (foundLine) {
            const matched = foundLine.match(/^[^:]+/);
            if (matched) {
                git(['stash', 'drop', matched[0]]);
                return true;
            }
        }
    }
    return false;
}
exports.revertLocalChanges = revertLocalChanges;
function getParentBranch(cwd) {
    const branchName = getBranchName(cwd);
    if (!branchName || branchName === 'HEAD') {
        return null;
    }
    const showBranchResult = git(['show-branch', '-a'], { cwd });
    if (showBranchResult.success) {
        const showBranchLines = showBranchResult.stdout.split(/\n/);
        const parentLine = showBranchLines.find(line => line.indexOf('*') > -1 && line.indexOf(branchName) < 0 && line.indexOf('publish_') < 0);
        if (!parentLine) {
            return null;
        }
        const matched = parentLine.match(/\[(.*)\]/);
        if (!matched) {
            return null;
        }
        return matched[1];
    }
    return null;
}
exports.getParentBranch = getParentBranch;
function getRemoteBranch(branch, cwd) {
    const results = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', `${branch}@\{u\}`], { cwd });
    if (results.success) {
        return results.stdout.trim();
    }
    return null;
}
exports.getRemoteBranch = getRemoteBranch;
function parseRemoteBranch(branch) {
    const firstSlashPos = branch.indexOf('/', 0);
    const remote = branch.substring(0, firstSlashPos);
    const remoteBranch = branch.substring(firstSlashPos + 1);
    return {
        remote,
        remoteBranch,
    };
}
exports.parseRemoteBranch = parseRemoteBranch;
function normalizeRepoUrl(repositoryUrl) {
    try {
        const parsed = git_url_parse_1.default(repositoryUrl);
        return parsed
            .toString('https')
            .replace(/\.git$/, '')
            .toLowerCase();
    }
    catch (e) {
        return '';
    }
}
function getDefaultRemoteBranch(branch = 'master', cwd) {
    const defaultRemote = getDefaultRemote(cwd);
    return `${defaultRemote}/${branch}`;
}
exports.getDefaultRemoteBranch = getDefaultRemoteBranch;
function getDefaultRemote(cwd) {
    let packageJson;
    try {
        packageJson = fs_extra_1.default.readJSONSync(path_1.default.join(paths_1.findGitRoot(cwd), 'package.json'));
    }
    catch (e) {
        console.log('failed to read package.json');
        throw new Error('invalid package.json detected');
    }
    const { repository } = packageJson;
    let repositoryUrl = '';
    if (typeof repository === 'string') {
        repositoryUrl = repository;
    }
    else if (repository && repository.url) {
        repositoryUrl = repository.url;
    }
    const normalizedUrl = normalizeRepoUrl(repositoryUrl);
    const remotesResult = git(['remote', '-v'], { cwd });
    if (remotesResult.success) {
        const allRemotes = {};
        remotesResult.stdout.split('\n').forEach(line => {
            const parts = line.split(/\s+/);
            allRemotes[normalizeRepoUrl(parts[1])] = parts[0];
        });
        if (Object.keys(allRemotes).length > 0) {
            const remote = allRemotes[normalizedUrl];
            if (remote) {
                return remote;
            }
        }
    }
    console.log(`Defaults to "origin"`);
    return 'origin';
}
exports.getDefaultRemote = getDefaultRemote;
function listAllTrackedFiles(patterns, cwd) {
    if (patterns) {
        const results = git(['ls-files', ...patterns], { cwd });
        if (results.success) {
            return results.stdout.split(/\n/);
        }
    }
    return [];
}
exports.listAllTrackedFiles = listAllTrackedFiles;
//# sourceMappingURL=index.js.map