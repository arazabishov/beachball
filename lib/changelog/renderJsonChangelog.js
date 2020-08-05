"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("../tag");
function renderJsonChangelog(changelog, previousChangelog) {
    var _a;
    const result = {
        name: changelog.name,
        entries: ((_a = previousChangelog) === null || _a === void 0 ? void 0 : _a.entries) ? [...previousChangelog.entries] : [],
    };
    const newEntry = {
        date: changelog.date.toUTCString(),
        tag: tag_1.generateTag(changelog.name, changelog.version),
        version: changelog.version,
        comments: changelog.comments,
    };
    result.entries.unshift(newEntry);
    return result;
}
exports.renderJsonChangelog = renderJsonChangelog;
//# sourceMappingURL=renderJsonChangelog.js.map