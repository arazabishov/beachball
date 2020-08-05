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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const getPackageChangelogs_1 = require("./getPackageChangelogs");
const renderChangelog_1 = require("./renderChangelog");
const renderJsonChangelog_1 = require("./renderJsonChangelog");
const utils_1 = require("../monorepo/utils");
const mergeChangelogs_1 = require("./mergeChangelogs");
function writeChangelog(options, changeSet, packageInfos) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const groupedChangelogPaths = yield writeGroupedChangelog(options, changeSet, packageInfos);
        const groupedChangelogPathSet = new Set(groupedChangelogPaths);
        const changelogs = getPackageChangelogs_1.getPackageChangelogs(changeSet, packageInfos);
        // Use a standard for loop here to prevent potentially firing off multiple network requests at once
        // (in case any custom renderers have network requests)
        for (const pkg of Object.keys(changelogs)) {
            const packagePath = path_1.default.dirname(packageInfos[pkg].packageJsonPath);
            if ((_a = groupedChangelogPathSet) === null || _a === void 0 ? void 0 : _a.has(packagePath)) {
                console.log(`Changelog for ${pkg} has been written as a group here: ${packagePath}`);
            }
            else {
                yield writeChangelogFiles(options, changelogs[pkg], packagePath, false);
            }
        }
    });
}
exports.writeChangelog = writeChangelog;
function writeGroupedChangelog(options, changeSet, packageInfos) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.changelog) {
            return [];
        }
        const { groups: changelogGroups } = options.changelog;
        if (!changelogGroups || changelogGroups.length < 1) {
            return [];
        }
        const changelogs = getPackageChangelogs_1.getPackageChangelogs(changeSet, packageInfos);
        const groupedChangelogs = {};
        for (const pkg in changelogs) {
            const packagePath = path_1.default.dirname(packageInfos[pkg].packageJsonPath);
            const relativePath = path_1.default.relative(options.path, packagePath);
            for (const group of changelogGroups) {
                const { changelogPath, masterPackageName } = group;
                const masterPackage = packageInfos[masterPackageName];
                if (!masterPackage) {
                    console.warn(`master package ${masterPackageName} does not exist.`);
                    continue;
                }
                if (!fs_extra_1.default.existsSync(changelogPath)) {
                    console.warn(`changelog path ${changelogPath} does not exist.`);
                    continue;
                }
                const isInGroup = utils_1.isPathIncluded(relativePath, group.include, group.exclude);
                if (isInGroup) {
                    if (!groupedChangelogs[changelogPath]) {
                        groupedChangelogs[changelogPath] = {
                            changelogs: [],
                            masterPackage,
                        };
                    }
                    groupedChangelogs[changelogPath].changelogs.push(changelogs[pkg]);
                }
            }
        }
        const changelogAbsolutePaths = [];
        for (const changelogPath in groupedChangelogs) {
            const { masterPackage, changelogs } = groupedChangelogs[changelogPath];
            const groupedChangelog = mergeChangelogs_1.mergeChangelogs(changelogs, masterPackage);
            if (groupedChangelog) {
                yield writeChangelogFiles(options, groupedChangelog, changelogPath, true);
                changelogAbsolutePaths.push(path_1.default.resolve(changelogPath));
            }
        }
        return changelogAbsolutePaths;
    });
}
function writeChangelogFiles(options, newVersionChangelog, changelogPath, isGrouped) {
    return __awaiter(this, void 0, void 0, function* () {
        let previousJson;
        // Update CHANGELOG.json
        const changelogJsonFile = path_1.default.join(changelogPath, 'CHANGELOG.json');
        try {
            previousJson = fs_extra_1.default.existsSync(changelogJsonFile) ? fs_extra_1.default.readJSONSync(changelogJsonFile) : undefined;
        }
        catch (e) {
            console.warn('CHANGELOG.json is invalid:', e);
        }
        try {
            const nextJson = renderJsonChangelog_1.renderJsonChangelog(newVersionChangelog, previousJson);
            fs_extra_1.default.writeJSONSync(changelogJsonFile, nextJson, { spaces: 2 });
        }
        catch (e) {
            console.warn('Problem writing to CHANGELOG.json:', e);
        }
        // Update CHANGELOG.md
        if (newVersionChangelog.comments.major ||
            newVersionChangelog.comments.minor ||
            newVersionChangelog.comments.patch ||
            newVersionChangelog.comments.prerelease) {
            const changelogFile = path_1.default.join(changelogPath, 'CHANGELOG.md');
            const previousContent = fs_extra_1.default.existsSync(changelogFile) ? fs_extra_1.default.readFileSync(changelogFile).toString() : '';
            const newChangelog = yield renderChangelog_1.renderChangelog({
                previousJson,
                previousContent,
                newVersionChangelog,
                isGrouped,
                changelogOptions: options.changelog || {},
            });
            fs_extra_1.default.writeFileSync(changelogFile, newChangelog);
        }
    });
}
//# sourceMappingURL=writeChangelog.js.map