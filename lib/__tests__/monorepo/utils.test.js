"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../monorepo/utils");
describe('isPathIncluded', () => {
    it('should return true if path is included with single include path', () => {
        expect(utils_1.isPathIncluded('packages/a', 'packages/*')).toBeTruthy();
    });
    it('should return false if path is excluded with single exclude path', () => {
        expect(utils_1.isPathIncluded('packages/a', 'packages/*', '!packages/a')).toBeFalsy();
    });
    it('should return true if path is included with multiple include paths', () => {
        expect(utils_1.isPathIncluded('packages/a', ['packages/b', 'packages/a'], ['!packages/b'])).toBeTruthy();
    });
    it('should return false if path is excluded with multiple exclude paths', () => {
        expect(utils_1.isPathIncluded('packages/a', ['packages/*'], ['!packages/a'])).toBeFalsy();
    });
    it('should return false if include path is empty', () => {
        expect(utils_1.isPathIncluded('packages/a', '')).toBeFalsy();
    });
});
//# sourceMappingURL=utils.test.js.map