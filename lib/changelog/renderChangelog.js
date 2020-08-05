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
Object.defineProperty(exports, "__esModule", { value: true });
const renderPackageChangelog_1 = require("./renderPackageChangelog");
exports.markerComment = '<!-- Start content -->';
function renderChangelog(renderOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const { previousJson, previousContent = '', newVersionChangelog, isGrouped, changelogOptions: { renderPackageChangelog: customRenderPackageChangelog, customRenderers }, } = renderOptions;
        let previousLogEntries;
        if (previousContent.includes(exports.markerComment)) {
            // Preferably determine where the previous entries start based on a special comment
            previousLogEntries = previousContent.split(exports.markerComment, 2)[1].trim();
        }
        else {
            // Otherwise look for an h2 (used as version header with default renderer).
            // If that's not present, preserve the previous content as-is.
            const h2Match = previousContent.match(/^## /m);
            previousLogEntries = h2Match ? previousContent.substring(h2Match.index) : previousContent;
        }
        try {
            if (customRenderPackageChangelog || customRenderers) {
                console.log('Using custom renderer for package version changelog.');
            }
            const renderInfo = {
                previousJson,
                newVersionChangelog,
                isGrouped,
                renderers: Object.assign(Object.assign({}, renderPackageChangelog_1.defaultRenderers), customRenderers),
            };
            return ([
                renderChangelogHeader(newVersionChangelog),
                exports.markerComment,
                yield (customRenderPackageChangelog || renderPackageChangelog_1.renderPackageChangelog)(renderInfo),
                previousLogEntries,
            ]
                .join('\n\n')
                .trim() + '\n');
        }
        catch (err) {
            console.log('Error occurred rendering package version changelog:', err);
            return '';
        }
    });
}
exports.renderChangelog = renderChangelog;
function renderChangelogHeader(changelog) {
    return (`# Change Log - ${changelog.name}\n\n` +
        `This log was last generated on ${changelog.date.toUTCString()} and should not be manually modified.`);
}
//# sourceMappingURL=renderChangelog.js.map