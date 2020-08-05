"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPackageChangeTypes_1 = require("../../changefile/getPackageChangeTypes");
describe('getAllowedChangeTypes', () => {
    it('should calculate the correct allowed change type giving several disallowed change types', () => {
        const changeType = getPackageChangeTypes_1.getAllowedChangeType('major', ['major', 'minor']);
        expect(changeType).toBe('patch');
    });
    it('can handle prerelease only case', () => {
        const changeType = getPackageChangeTypes_1.getAllowedChangeType('patch', ['major', 'minor', 'patch']);
        expect(changeType).toBe('prerelease');
    });
});
//# sourceMappingURL=getPackageChangeTypes.test.js.map