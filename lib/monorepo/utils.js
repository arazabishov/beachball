"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch_1 = __importDefault(require("minimatch"));
/**
 * Check if a relative path should be included given include and exclude patterns using minimatch.
 */
function isPathIncluded(relativePath, include, exclude) {
    const includePatterns = typeof include === 'string' ? [include] : include;
    let shouldInclude = includePatterns.reduce((included, pattern) => included || minimatch_1.default(relativePath, pattern), false);
    if (exclude) {
        const excludePatterns = typeof exclude === 'string' ? [exclude] : exclude;
        shouldInclude = excludePatterns.reduce((excluded, pattern) => excluded && minimatch_1.default(relativePath, pattern), shouldInclude);
    }
    return shouldInclude;
}
exports.isPathIncluded = isPathIncluded;
//# sourceMappingURL=utils.js.map