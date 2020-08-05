"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const updateRelatedChangeType_1 = require("../../bump/updateRelatedChangeType");
const lodash_1 = __importDefault(require("lodash"));
describe('updateRelatedChangeType', () => {
    const bumpInfoFixture = {
        changes: new Map(),
        dependents: {},
        packageChangeTypes: {},
        dependentChangeTypes: {
            foo: 'patch',
        },
        packageInfos: {
            foo: {
                name: 'foo',
                options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
            },
            bar: {
                name: 'bar',
                options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
            },
        },
        modifiedPackages: new Set(),
        newPackages: new Set(),
        packageGroups: {},
        groupOptions: {},
    };
    it('should bump dependent packages with "patch" change type by default', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependents: {
                foo: ['bar'],
            },
            packageChangeTypes: {
                foo: 'minor',
            },
            dependentChangeTypes: {
                foo: 'patch',
            },
            packageInfos: {
                bar: {
                    dependencies: {
                        foo: '1.0.0',
                    },
                },
            },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'minor', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('patch');
    });
    it('should bump dependent packages according to the bumpInfo.dependentChangeTypes', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependents: {
                foo: ['bar'],
            },
            packageChangeTypes: {
                foo: 'patch',
            },
            dependentChangeTypes: {
                foo: 'minor',
            },
            packageInfos: {
                bar: {
                    dependencies: {
                        foo: '1.0.0',
                    },
                },
            },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'patch', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('minor');
    });
    it('should bump all packages in a group together as minor', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                foo: 'minor',
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                },
                unrelated: {},
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'minor', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['unrelated']).toBeUndefined();
    });
    it('should bump all packages in a group together as patch', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                foo: 'patch',
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                },
                unrelated: {},
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'patch', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['unrelated']).toBeUndefined();
    });
    it('should bump all packages in a group together as none', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                foo: 'patch',
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                },
                unrelated: {},
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'none', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('none');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('none');
        expect(bumpInfo.packageChangeTypes['unrelated']).toBeUndefined();
    });
    it('should bump all packages in a group together as none with dependents', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependents: {
                foo: ['bar'],
            },
            dependentChangeTypes: {
                foo: 'none',
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                },
                unrelated: {},
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'none', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('none');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('none');
        expect(bumpInfo.packageChangeTypes['unrelated']).toBeUndefined();
    });
    it('should bump all grouped packages, if a dependency was bumped', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                dep: 'minor',
            },
            dependents: {
                dep: ['bar'],
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                    dependencies: {
                        dep: '1.0.0',
                    },
                },
                dep: {
                    name: 'dep',
                    options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
                },
                unrelated: {
                    name: 'unrelated',
                    options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
                },
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('dep', 'patch', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['dep']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['unrelated']).toBeUndefined();
    });
    it('should bump dependent package, if a dependency was in a group', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                dep: 'minor',
            },
            dependents: {
                dep: ['bar'],
                foo: ['app'],
            },
            packageInfos: {
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                    dependencies: {
                        dep: '1.0.0',
                    },
                },
                dep: {
                    name: 'dep',
                    options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
                },
                app: {
                    name: 'app',
                    dependencies: {
                        foo: '1.0.0',
                    },
                    options: { disallowedChangeTypes: [], defaultNpmTag: 'latest' },
                },
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('dep', 'patch', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['dep']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['app']).toBe('minor');
    });
    it('should propagate dependent change type across group', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            dependentChangeTypes: {
                mergeStyles: 'minor',
            },
            dependents: {
                mergeStyles: ['styling'],
                styling: ['bar'],
                utils: ['bar'],
                bar: ['datetime'],
                datetimeUtils: ['datetime'],
            },
            packageInfos: {
                styling: {
                    name: 'styling',
                    dependencies: {
                        mergeStyles: '1.0.0',
                    },
                },
                utils: {
                    name: 'utils',
                },
                mergeStyles: {
                    name: 'mergeStyles',
                },
                foo: {
                    group: 'grp',
                },
                bar: {
                    group: 'grp',
                    dependencies: {
                        styling: '1.0.0',
                        utils: '1.0.0',
                    },
                },
                datetime: {
                    name: 'datetime',
                    dependencies: {
                        bar: '1.0.0',
                        datetimeUtils: '1.0.0',
                    },
                },
                datetimeUtils: {
                    name: 'app',
                },
            },
            packageGroups: { grp: { packageNames: ['foo', 'bar'] } },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('mergeStyles', 'patch', bumpInfo, true);
        updateRelatedChangeType_1.updateRelatedChangeType('datetimeUtils', 'patch', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['bar']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['mergeStyles']).toBe('patch');
        expect(bumpInfo.packageChangeTypes['datetime']).toBe('minor');
        expect(bumpInfo.packageChangeTypes['datetimeUtils']).toBe('patch');
    });
    it('should respect disallowed change type', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            packageInfos: {
                foo: {
                    options: { disallowedChangeTypes: ['minor', 'major'], defaultNpmTag: 'latest' },
                },
            },
        });
        updateRelatedChangeType_1.updateRelatedChangeType('foo', 'major', bumpInfo, true);
        expect(bumpInfo.packageChangeTypes['foo']).toBe('patch');
    });
});
//# sourceMappingURL=updateRelatedChangeType.test.js.map