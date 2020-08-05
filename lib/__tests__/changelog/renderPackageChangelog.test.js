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
const renderPackageChangelog_1 = require("../../changelog/renderPackageChangelog");
const { renderEntry, renderEntries, renderChangeTypeHeader, renderChangeTypeSection, renderHeader } = renderPackageChangelog_1.defaultRenderers;
const leadingNewlineRegex = /^\n/;
const trailingNewlineRegex = /\n$/;
describe('changelog renderers -', () => {
    function getRenderInfo() {
        return {
            isGrouped: false,
            newVersionChangelog: {
                date: new Date('Thu Aug 22 2019 14:20:40 GMT-0700 (Pacific Daylight Time)'),
                name: 'foo',
                tag: 'foo_v1.2.3',
                version: '1.2.3',
                comments: {
                    major: [],
                    minor: [
                        { comment: 'Awesome change', author: 'user1@example.com', commit: 'sha1', package: 'foo' },
                        { comment: 'Boring change', author: 'user2@example.com', commit: 'sha2', package: 'foo' },
                    ],
                    patch: [
                        { comment: 'Fix', author: 'user1@example.com', commit: 'sha3', package: 'foo' },
                        { comment: 'stuff', author: 'user2@example.com', commit: 'sha4', package: 'foo' },
                    ],
                },
            },
            previousJson: {},
            renderers: Object.assign({}, renderPackageChangelog_1.defaultRenderers),
        };
    }
    function getGroupedRenderInfo() {
        const renderInfo = getRenderInfo();
        renderInfo.isGrouped = true;
        renderInfo.newVersionChangelog.comments.minor[0].package = 'bar';
        renderInfo.newVersionChangelog.comments.patch[1].package = 'bar';
        return renderInfo;
    }
    function doBasicTests(result) {
        expect(result).not.toMatch(leadingNewlineRegex);
        expect(result).not.toMatch(trailingNewlineRegex);
        expect(result).toMatchSnapshot();
    }
    describe('renderEntry', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderEntry(renderInfo.newVersionChangelog.comments.minor[0], renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderEntry(renderInfo.newVersionChangelog.comments.minor[0], renderInfo);
            doBasicTests(result);
        }));
    });
    describe('renderEntries', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderEntries('minor', renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderEntries('minor', renderInfo);
            doBasicTests(result);
        }));
    });
    describe('renderChangeTypeHeader', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderChangeTypeHeader('minor', renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderChangeTypeHeader('minor', renderInfo);
            doBasicTests(result);
        }));
    });
    describe('renderChangeTypeSection', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderChangeTypeSection('minor', renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderChangeTypeSection('minor', renderInfo);
            doBasicTests(result);
        }));
    });
    describe('renderHeader', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderHeader(renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderHeader(renderInfo);
            doBasicTests(result);
        }));
    });
    describe('renderPackageChangelog', () => {
        it('has correct output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            doBasicTests(result);
        }));
        it('has correct grouped output', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            doBasicTests(result);
        }));
        it('uses custom renderEntry', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getGroupedRenderInfo();
            renderInfo.renderers.renderEntry = (entry, renderInfo) => __awaiter(void 0, void 0, void 0, function* () { return `- ${entry.comment} (#123)`; });
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            expect(result).toContain('#123');
            expect(result).toMatchSnapshot();
        }));
        it('uses custom renderEntries', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            renderInfo.renderers.renderEntries = (changeType, renderInfo) => __awaiter(void 0, void 0, void 0, function* () {
                const entries = renderInfo.newVersionChangelog.comments[changeType];
                return entries ? entries.map(entry => `${entry.comment}!!!`).join('\n\n') : '';
            });
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            expect(result).toContain('!!!');
            expect(result).toMatchSnapshot();
        }));
        it('uses custom renderChangeTypeHeader', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            renderInfo.renderers.renderChangeTypeHeader = (changeType, renderInfo) => __awaiter(void 0, void 0, void 0, function* () { return changeType === 'minor' || changeType === 'major' ? '### Important stuff' : '### Boring stuff'; });
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            expect(result).toContain('### Important stuff');
            expect(result).toMatchSnapshot();
        }));
        it('uses custom renderChangeTypeSection', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            renderInfo.renderers.renderChangeTypeSection = (changeType, renderInfo) => __awaiter(void 0, void 0, void 0, function* () { return changeType === 'minor' || changeType === 'major' ? renderChangeTypeSection(changeType, renderInfo) : ''; });
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            expect(result).not.toContain('Patches');
            expect(result).toMatchSnapshot();
        }));
        it('uses custom renderHeader', () => __awaiter(void 0, void 0, void 0, function* () {
            const renderInfo = getRenderInfo();
            renderInfo.renderers.renderHeader = (renderInfo) => __awaiter(void 0, void 0, void 0, function* () {
                return [
                    `## ${renderInfo.newVersionChangelog.version}`,
                    renderInfo.newVersionChangelog.date.toUTCString(),
                    `[Compare changes](http://real-github-compare-link)`,
                ].join('\n');
            });
            const result = yield renderPackageChangelog_1.renderPackageChangelog(renderInfo);
            expect(result).toContain('Compare changes');
            expect(result).toMatchSnapshot();
        }));
    });
});
//# sourceMappingURL=renderPackageChangelog.test.js.map