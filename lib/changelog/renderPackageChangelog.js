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
const lodash_1 = __importDefault(require("lodash"));
const groupNames = {
    major: 'Major changes',
    minor: 'Minor changes',
    patch: 'Patches',
    prerelease: 'Changes',
    none: '',
};
exports.defaultRenderers = {
    renderHeader: _renderHeader,
    renderChangeTypeSection: _renderChangeTypeSection,
    renderChangeTypeHeader: _renderChangeTypeHeader,
    renderEntries: _renderEntries,
    renderEntry: _renderEntry,
};
function renderPackageChangelog(renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { renderHeader, renderChangeTypeSection } = renderInfo.renderers;
        const versionHeader = yield renderHeader(renderInfo);
        return [
            versionHeader,
            yield renderChangeTypeSection('major', renderInfo),
            yield renderChangeTypeSection('minor', renderInfo),
            yield renderChangeTypeSection('patch', renderInfo),
            yield renderChangeTypeSection('prerelease', renderInfo),
        ]
            .filter(Boolean)
            .join('\n\n');
    });
}
exports.renderPackageChangelog = renderPackageChangelog;
function _renderHeader(renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return `## ${renderInfo.newVersionChangelog.version}\n\n${renderInfo.newVersionChangelog.date.toUTCString()}`;
    });
}
function _renderChangeTypeSection(changeType, renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { renderChangeTypeHeader, renderEntries } = renderInfo.renderers;
        const entries = renderInfo.newVersionChangelog.comments[changeType];
        return entries && entries.length
            ? `${yield renderChangeTypeHeader(changeType, renderInfo)}\n\n${yield renderEntries(changeType, renderInfo)}`
            : '';
    });
}
function _renderChangeTypeHeader(changeType, renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return `### ${groupNames[changeType]}`;
    });
}
function _renderEntries(changeType, renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = renderInfo.newVersionChangelog.comments[changeType];
        if (!entries || !entries.length) {
            return '';
        }
        if (renderInfo.isGrouped) {
            const entriesByPackage = lodash_1.default.entries(lodash_1.default.groupBy(entries, entry => entry.package));
            // Use a for loop here (not map) so that if renderEntry does network requests, we don't fire them all at once
            let packagesText = [];
            for (const [pkgName, pkgEntries] of entriesByPackage) {
                const entriesText = (yield _renderEntriesBasic(pkgEntries, renderInfo)).map(entry => `  ${entry}`).join('\n');
                packagesText.push(`- \`${pkgName}\`\n${entriesText}`);
            }
            return packagesText.join('\n');
        }
        return (yield _renderEntriesBasic(entries, renderInfo)).join('\n');
    });
}
function _renderEntriesBasic(entries, renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        // Use a for loop here (not map) so that if renderEntry does network requests, we don't fire them all at once
        let results = [];
        for (const entry of entries) {
            results.push(yield renderInfo.renderers.renderEntry(entry, renderInfo));
        }
        return results;
    });
}
function _renderEntry(entry, renderInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return `- ${entry.comment} (${entry.author})`;
    });
}
//# sourceMappingURL=renderPackageChangelog.js.map