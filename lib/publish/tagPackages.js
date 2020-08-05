"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../tag");
const git_1 = require("../git");
function createTag(tag, cwd) {
    git_1.gitFailFast(['tag', '-a', '-f', tag, '-m', tag], { cwd });
}
function tagPackages(bumpInfo, cwd) {
    const { modifiedPackages, newPackages } = bumpInfo;
    [...modifiedPackages, ...newPackages].forEach(pkg => {
        const packageInfo = bumpInfo.packageInfos[pkg];
        const changeType = bumpInfo.packageChangeTypes[pkg];
        // Do not tag change type of "none", private packages, or packages opting out of tagging
        if (changeType === 'none' || packageInfo.private || !packageInfo.options.gitTags) {
            return;
        }
        console.log(`Tagging - ${packageInfo.name}@${packageInfo.version}`);
        const generatedTag = tag_1.generateTag(packageInfo.name, packageInfo.version);
        createTag(generatedTag, cwd);
    });
}
exports.tagPackages = tagPackages;
function tagDistTag(tag, cwd) {
    if (tag && tag !== 'latest') {
        createTag(tag, cwd);
    }
}
exports.tagDistTag = tagDistTag;
//# sourceMappingURL=tagPackages.js.map