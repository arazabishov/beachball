"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
function bumpMinSemverRange(minVersion, semverRange) {
    if (semverRange === '*') {
        return semverRange;
    }
    if (semverRange.startsWith('~') || semverRange.startsWith('^')) {
        // ~1.0.0
        // ^1.0.0
        return semverRange[0] + minVersion;
    }
    else if (semverRange.includes('>')) {
        // Less frequently used, but we treat any of these kinds of ranges to be within a minor band for now: more complex understand of the semver range utility is needed to do more
        // >=1.0.0 <2.0.0
        return `>=${minVersion} <${semver_1.default.inc(minVersion, 'major')}`;
    }
    else if (semverRange.includes(' - ')) {
        // 1.0.0 - 2.0.0
        return `${minVersion} - ${semver_1.default.inc(minVersion, 'major')}`;
    }
    return minVersion;
}
exports.bumpMinSemverRange = bumpMinSemverRange;
//# sourceMappingURL=bumpMinSemverRange.js.map