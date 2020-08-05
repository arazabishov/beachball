"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeChangelogs_1 = require("../../changelog/mergeChangelogs");
describe('mergeChangelogs', () => {
    const mockDate = new Date('Thu Aug 22 2019 14:20:40 GMT-0700 (Pacific Daylight Time)');
    const mockDate2 = new Date('Thu Aug 22 2020 14:20:40 GMT-0700 (Pacific Daylight Time)');
    it('merge changelogs when master package has change', () => {
        var _a;
        const masterChangelog = {
            name: 'master',
            date: mockDate,
            version: '1.0.0',
            tag: 'master_v1.0.0',
            comments: {
                patch: [
                    {
                        comment: 'comment_master',
                        author: 'author_master',
                        commit: 'commit_master',
                        package: 'master',
                    },
                ],
            },
        };
        const changelogs = [
            masterChangelog,
            {
                name: 'foo',
                date: mockDate2,
                version: '1.0.0',
                tag: 'foo_v1.0.0',
                comments: {
                    patch: [
                        {
                            comment: 'comment_foo',
                            author: 'author_foo',
                            commit: 'commit_foo',
                            package: 'foo',
                        },
                    ],
                },
            },
        ];
        const mergedChangelog = mergeChangelogs_1.mergeChangelogs(changelogs, { name: 'master', version: '1.2.3' });
        expect(mergedChangelog).toBeDefined();
        expect(mergedChangelog.name).toBe('master');
        expect(mergedChangelog.version).toBe('1.2.3');
        expect(mergedChangelog.date).toBeDefined();
        expect((_a = mergedChangelog.comments.patch) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
    });
    it('merge changelogs when master package has no change', () => {
        const changelogs = [
            {
                name: 'foo',
                date: mockDate2,
                version: '1.0.0',
                tag: 'foo_v1.0.0',
                comments: {
                    patch: [
                        {
                            comment: 'comment_foo',
                            author: 'author_foo',
                            commit: 'commit_foo',
                            package: 'foo',
                        },
                    ],
                },
            },
        ];
        const mergedChangelog = mergeChangelogs_1.mergeChangelogs(changelogs, { name: 'master', version: '1.2.3' });
        expect(mergedChangelog).toBeDefined();
        expect(mergedChangelog.name).toBe('master');
        expect(mergedChangelog.version).toBe('1.2.3');
        expect(mergedChangelog.date).toBeDefined();
        expect(mergedChangelog.comments.patch).toEqual(changelogs[0].comments.patch);
    });
});
//# sourceMappingURL=mergeChangelogs.test.js.map