"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidChangeType(changeType) {
    return ['patch', 'major', 'minor', 'prerelease', 'none'].includes(changeType);
}
exports.isValidChangeType = isValidChangeType;
//# sourceMappingURL=isValidChangeType.js.map