"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isGitAvailable_1 = require("./isGitAvailable");
const git_1 = require("../git");
const isValidPackageName_1 = require("./isValidPackageName");
const isValidChangeType_1 = require("./isValidChangeType");
const isChangeFileNeeded_1 = require("./isChangeFileNeeded");
const isValidGroupOptions_1 = require("./isValidGroupOptions");
const isValidChangelogOptions_1 = require("./isValidChangelogOptions");
const readChangeFiles_1 = require("../changefile/readChangeFiles");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const getPackageGroups_1 = require("../monorepo/getPackageGroups");
const getDisallowedChangeTypes_1 = require("../changefile/getDisallowedChangeTypes");
function validate(options, validateOptions = { allowMissingChangeFiles: false }) {
    var _a;
    // Validation Steps
    if (!isGitAvailable_1.isGitAvailable(options.path)) {
        console.error('ERROR: Please make sure git is installed and initialize the repository with "git init".');
        process.exit(1);
    }
    const untracked = git_1.getUntrackedChanges(options.path);
    if (untracked && untracked.length > 0) {
        console.warn('WARN: There are untracked changes in your repository:');
        console.warn('- ' + untracked.join('\n- '));
        console.warn('Changes in these files will not trigger a prompt for change descriptions');
    }
    if (options.package && !isValidPackageName_1.isValidPackageName(options.package, options.path)) {
        console.error('ERROR: Specified package name is not valid');
        process.exit(1);
    }
    if (options.type && !isValidChangeType_1.isValidChangeType(options.type)) {
        console.error(`ERROR: change type ${options.type} is not valid`);
        process.exit(1);
    }
    const isChangeNeeded = isChangeFileNeeded_1.isChangeFileNeeded(options);
    if (isChangeNeeded && !validateOptions.allowMissingChangeFiles) {
        console.error('ERROR: Change files are needed!');
        console.log(options.changehint);
        process.exit(1);
    }
    if (options.groups && !isValidGroupOptions_1.isValidGroupOptions(options.path, options.groups)) {
        console.error('ERROR: Groups defined inside the configuration is invalid');
        console.log(options.groups);
        process.exit(1);
    }
    if (options.changelog && !isValidChangelogOptions_1.isValidChangelogOptions(options.changelog)) {
        console.error('ERROR: Changelog defined inside the configuration is invalid');
        console.log(options.changelog);
        process.exit(1);
    }
    const changeSet = readChangeFiles_1.readChangeFiles(options);
    const packageInfos = getPackageInfos_1.getPackageInfos(options.path);
    const packageGroups = getPackageGroups_1.getPackageGroups(packageInfos, options.path, options.groups);
    for (const [changeFile, change] of changeSet) {
        const disallowedChangeTypes = getDisallowedChangeTypes_1.getDisallowedChangeTypes(change.packageName, packageInfos, packageGroups);
        if (!change.type || !isValidChangeType_1.isValidChangeType(change.type) || ((_a = disallowedChangeTypes) === null || _a === void 0 ? void 0 : _a.includes(change.type))) {
            console.error(`ERROR: there is an invalid change type detected ${changeFile}: "${change.type}" is not a valid change type`);
            process.exit(1);
        }
    }
    return {
        isChangeNeeded,
    };
}
exports.validate = validate;
//# sourceMappingURL=validate.js.map