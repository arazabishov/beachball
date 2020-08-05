"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validatePackageDependencies_1 = require("../../publish/validatePackageDependencies");
const lodash_1 = __importDefault(require("lodash"));
describe('validatePackageDependencies', () => {
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
            },
            bar: {
                name: 'bar',
            },
        },
        modifiedPackages: new Set(),
        newPackages: new Set(),
        scopedPackages: new Set(['foo', 'bar']),
        packageGroups: {},
        groupOptions: {},
    };
    it('invalid when dependencies contains private package', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            packageInfos: {
                foo: {
                    private: true,
                },
                bar: {
                    dependencies: {
                        foo: '1.0.0',
                    },
                },
            },
            modifiedPackages: new Set(['bar']),
            newPackages: new Set(['foo']),
        });
        expect(validatePackageDependencies_1.validatePackageDependencies(bumpInfo)).toBeFalsy();
    });
    it('valid when devDependencies contains private package', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            packageInfos: {
                foo: {
                    private: true,
                },
                bar: {
                    devDependencies: {
                        foo: '1.0.0',
                    },
                },
            },
            modifiedPackages: new Set(['bar']),
            newPackages: new Set(['foo']),
        });
        expect(validatePackageDependencies_1.validatePackageDependencies(bumpInfo)).toBeTruthy();
    });
    it('valid when no private package is listed as dependency', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            packageInfos: {
                bar: {
                    devDependencies: {
                        foo: '1.0.0',
                    },
                },
            },
            modifiedPackages: new Set(['bar']),
            newPackages: new Set(['foo']),
        });
        expect(validatePackageDependencies_1.validatePackageDependencies(bumpInfo)).toBeTruthy();
    });
    it('valid when no package has dependency', () => {
        const bumpInfo = lodash_1.default.merge(lodash_1.default.cloneDeep(bumpInfoFixture), {
            modifiedPackages: new Set(['foo', 'bar']),
        });
        expect(validatePackageDependencies_1.validatePackageDependencies(bumpInfo)).toBeTruthy();
    });
});
//# sourceMappingURL=validatePackageDependencies.test.js.map