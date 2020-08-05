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
const registry_1 = require("../fixtures/registry");
const package_1 = require("../fixtures/package");
const packagePublish_1 = require("../packageManager/packagePublish");
const npm_1 = require("../packageManager/npm");
describe('packageManager', () => {
    let registry;
    beforeAll(() => {
        registry = new registry_1.Registry();
        jest.setTimeout(30000);
    });
    afterAll(() => {
        registry.stop();
    });
    describe('packagePublish', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield registry.reset();
        }));
        it('can publish', () => {
            const publishResult = packagePublish_1.packagePublish(package_1.testPackageInfo, registry.getUrl(), '', package_1.testTag, '');
            expect(publishResult.success).toBeTruthy();
            const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', package_1.testPackageInfo.name, '--json']);
            expect(showResult.success).toBeTruthy();
            const show = JSON.parse(showResult.stdout);
            expect(show.name).toEqual(package_1.testPackageInfo.name);
            expect(show['dist-tags'][package_1.testTag]).toEqual(package_1.testPackageInfo.version);
            expect(show.versions.length).toEqual(1);
            expect(show.versions[0]).toEqual(package_1.testPackageInfo.version);
        });
        it('errors on republish', () => {
            let publishResult = packagePublish_1.packagePublish(package_1.testPackageInfo, registry.getUrl(), '', package_1.testTag, '');
            expect(publishResult.success).toBeTruthy();
            publishResult = packagePublish_1.packagePublish(package_1.testPackageInfo, registry.getUrl(), '', package_1.testTag, '');
            expect(publishResult.success).toBeFalsy();
        });
        it('publish with no tag publishes latest', () => {
            const publishResult = packagePublish_1.packagePublish(package_1.testPackageInfo, registry.getUrl(), '', undefined, '');
            expect(publishResult.success).toBeTruthy();
            const showResult = npm_1.npm(['--registry', registry.getUrl(), 'show', package_1.testPackageInfo.name, '--json']);
            expect(showResult.success).toBeTruthy();
            const show = JSON.parse(showResult.stdout);
            expect(show.name).toEqual(package_1.testPackageInfo.name);
            expect(show['dist-tags']['latest']).toEqual(package_1.testPackageInfo.version);
            expect(show.versions.length).toEqual(1);
            expect(show.versions[0]).toEqual(package_1.testPackageInfo.version);
        });
        it('publish package with defaultNpmTag publishes as defaultNpmTag', () => {
            const testPackageInfoWithDefaultNpmTag = Object.assign(Object.assign({}, package_1.testPackageInfo), { options: { gitTags: true, defaultNpmTag: package_1.testTag, disallowedChangeTypes: null } });
            const publishResult = packagePublish_1.packagePublish(testPackageInfoWithDefaultNpmTag, registry.getUrl(), '', undefined, '');
            expect(publishResult.success).toBeTruthy();
            const showResult = npm_1.npm([
                '--registry',
                registry.getUrl(),
                'show',
                testPackageInfoWithDefaultNpmTag.name,
                '--json',
            ]);
            expect(showResult.success).toBeTruthy();
            const show = JSON.parse(showResult.stdout);
            expect(show.name).toEqual(testPackageInfoWithDefaultNpmTag.name);
            expect(show['dist-tags'][package_1.testTag]).toEqual(testPackageInfoWithDefaultNpmTag.version);
            expect(show.versions.length).toEqual(1);
            expect(show.versions[0]).toEqual(testPackageInfoWithDefaultNpmTag.version);
        });
        it('publish with specified tag overrides defaultNpmTag', () => {
            const testPackageInfoWithDefaultNpmTag = Object.assign(Object.assign({}, package_1.testPackageInfo), { options: { gitTags: true, defaultNpmTag: 'thisShouldNotBeUsed', disallowedChangeTypes: null } });
            const publishResult = packagePublish_1.packagePublish(testPackageInfoWithDefaultNpmTag, registry.getUrl(), '', package_1.testTag, '');
            expect(publishResult.success).toBeTruthy();
            const showResult = npm_1.npm([
                '--registry',
                registry.getUrl(),
                'show',
                testPackageInfoWithDefaultNpmTag.name,
                '--json',
            ]);
            expect(showResult.success).toBeTruthy();
            const show = JSON.parse(showResult.stdout);
            expect(show.name).toEqual(testPackageInfoWithDefaultNpmTag.name);
            expect(show['dist-tags'][package_1.testTag]).toEqual(testPackageInfoWithDefaultNpmTag.version);
            expect(show.versions.length).toEqual(1);
            expect(show.versions[0]).toEqual(testPackageInfoWithDefaultNpmTag.version);
        });
    });
});
//# sourceMappingURL=packageManager.test.js.map