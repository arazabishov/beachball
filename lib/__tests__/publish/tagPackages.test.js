"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tagPackages_1 = require("../../publish/tagPackages");
const tag_1 = require("../../tag");
const git_1 = require("../../git");
jest.mock('../../git', () => ({
    gitFailFast: jest.fn(),
}));
const createTagParameters = (tag, cwd) => {
    return [['tag', '-a', '-f', tag, '-m', tag], { cwd }];
};
const noTagBumpInfo = {
    packageChangeTypes: {
        foo: 'minor',
        bar: 'major',
    },
    packageInfos: {
        foo: {
            name: 'foo',
            version: '1.0.0',
            options: {
                gitTags: false,
            }
        },
        bar: {
            name: 'bar',
            version: '1.0.1',
            options: {
                gitTags: false,
            }
        },
    },
    modifiedPackages: new Set(['foo', 'bar']),
    newPackages: new Set(),
};
const oneTagBumpInfo = {
    packageChangeTypes: {
        foo: 'minor',
        bar: 'major',
    },
    packageInfos: {
        foo: {
            name: 'foo',
            version: '1.0.0',
            options: {
                gitTags: true,
            }
        },
        bar: {
            name: 'bar',
            version: '1.0.1',
            options: {
                gitTags: false,
            }
        },
    },
    modifiedPackages: new Set(['foo', 'bar']),
    newPackages: new Set(),
};
beforeEach(() => {
    git_1.gitFailFast.mockReset();
});
describe('tagPackages', () => {
    it('createTag is not called for packages without gitTags', () => {
        tagPackages_1.tagPackages(noTagBumpInfo, /* cwd*/ '');
        expect(git_1.gitFailFast).not.toHaveBeenCalled();
    });
    it('createTag is called for packages with gitTags', () => {
        tagPackages_1.tagPackages(oneTagBumpInfo, /* cwd*/ '');
        expect(git_1.gitFailFast).toHaveBeenCalledTimes(1);
        // verify git is being called to create new auto tag for foo and bar
        const newFooTag = tag_1.generateTag('foo', oneTagBumpInfo.packageInfos['foo'].version);
        expect(git_1.gitFailFast).toHaveBeenCalledWith(...createTagParameters(newFooTag, ''));
    });
});
describe('tagDistTag', () => {
    it('createTag is not called for an empty dist tag', () => {
        tagPackages_1.tagDistTag(/* tag */ '', /* cwd*/ '');
        expect(git_1.gitFailFast).not.toHaveBeenCalled();
    });
    it('createTag is called for unique dist tags', () => {
        tagPackages_1.tagDistTag(/* tag */ 'abc', /* cwd*/ '');
        expect(git_1.gitFailFast).toBeCalledTimes(1);
        expect(git_1.gitFailFast).toHaveBeenCalledWith(...createTagParameters('abc', ''));
    });
});
//# sourceMappingURL=tagPackages.test.js.map