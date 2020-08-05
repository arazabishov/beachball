"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getChangedPackages_1 = require("./getChangedPackages");
const git_1 = require("../git");
const prompts_1 = __importDefault(require("prompts"));
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const semver_1 = require("semver");
const getPackageGroups_1 = require("../monorepo/getPackageGroups");
const isValidChangeType_1 = require("../validation/isValidChangeType");
const getDisallowedChangeTypes_1 = require("./getDisallowedChangeTypes");
/**
 * Uses `prompts` package to prompt for change type and description, fills in git user.email, scope, and the commit hash
 */
function promptForChange(options) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { branch, path: cwd, package: specificPackage } = options;
        const changedPackages = specificPackage ? [specificPackage] : getChangedPackages_1.getChangedPackages(options);
        const recentMessages = git_1.getRecentCommitMessages(branch, cwd) || [];
        const packageChangeInfo = {};
        const packageInfos = getPackageInfos_1.getPackageInfos(cwd);
        const packageGroups = getPackageGroups_1.getPackageGroups(packageInfos, options.path, options.groups);
        for (let pkg of changedPackages) {
            console.log('');
            console.log(`Please describe the changes for: ${pkg}`);
            const disallowedChangeTypes = getDisallowedChangeTypes_1.getDisallowedChangeTypes(pkg, packageInfos, packageGroups);
            const packageInfo = packageInfos[pkg];
            const showPrereleaseOption = semver_1.prerelease(packageInfo.version);
            const changeTypePrompt = {
                type: 'select',
                name: 'type',
                message: 'Change type',
                choices: [
                    ...(showPrereleaseOption ? [{ value: 'prerelease', title: ' [1mPrerelease[22m - bump prerelease version' }] : []),
                    { value: 'patch', title: ' [1mPatch[22m      - bug fixes; no backwards incompatible changes.' },
                    { value: 'minor', title: ' [1mMinor[22m      - small feature; backwards compatible changes.' },
                    { value: 'none', title: ' [1mNone[22m       - this change does not affect the published package in any way.' },
                    { value: 'major', title: ' [1mMajor[22m      - major feature; breaking changes.' },
                ].filter(choice => { var _a; return !((_a = disallowedChangeTypes) === null || _a === void 0 ? void 0 : _a.includes(choice.value)); }),
            };
            if (changeTypePrompt.choices.length === 0) {
                console.log('No valid changeTypes available, aborting');
                return;
            }
            if (options.type && ((_a = disallowedChangeTypes) === null || _a === void 0 ? void 0 : _a.includes(options.type))) {
                console.log(`${options.type} type is not allowed, aborting`);
                return;
            }
            const descriptionPrompt = {
                type: 'autocomplete',
                name: 'comment',
                message: 'Describe changes (type or choose one)',
                suggest: input => {
                    return Promise.resolve([...recentMessages.filter(msg => msg.startsWith(input)), input]);
                },
            };
            const showChangeTypePrompt = !options.type && changeTypePrompt.choices.length > 1;
            const defaultPrompt = {
                changeType: showChangeTypePrompt ? changeTypePrompt : undefined,
                description: !options.message ? descriptionPrompt : undefined,
            };
            let questions = [defaultPrompt.changeType, defaultPrompt.description];
            if ((_b = packageInfo.options.changeFilePrompt) === null || _b === void 0 ? void 0 : _b.changePrompt) {
                questions = (_c = packageInfo.options.changeFilePrompt) === null || _c === void 0 ? void 0 : _c.changePrompt(defaultPrompt);
            }
            questions = questions.filter(q => !!q);
            let response = {
                type: options.type || 'none',
                comment: options.message || '',
            };
            if (questions.length > 0) {
                response = (yield prompts_1.default(questions));
                if (Object.keys(response).length === 0) {
                    console.log('Cancelled, no change files are written');
                    return;
                }
                if (!isValidChangeType_1.isValidChangeType(response.type)) {
                    console.error('Prompt response contains invalid change type.');
                    return;
                }
            }
            packageChangeInfo[pkg] = Object.assign(Object.assign({}, response), { packageName: pkg, email: git_1.getUserEmail(cwd) || 'email not defined', dependentChangeType: response.type === 'none' ? 'none' : 'patch', date: new Date() });
        }
        return packageChangeInfo;
    });
}
exports.promptForChange = promptForChange;
//# sourceMappingURL=promptForChange.js.map