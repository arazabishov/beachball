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
const getScopedPackages_1 = require("../../monorepo/getScopedPackages");
const monorepo_1 = require("../../fixtures/monorepo");
describe('getScopedPackages', () => {
    let repoFactory;
    let repo;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repoFactory = new monorepo_1.MonoRepoFactory();
        yield repoFactory.create();
        repo = yield repoFactory.cloneRepository();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield repoFactory.cleanUp();
    }));
    it('can scope packages', () => __awaiter(void 0, void 0, void 0, function* () {
        const scopedPackages = getScopedPackages_1.getScopedPackages({
            path: repo.rootPath,
            scope: ['packages/grouped/*'],
        });
        expect(scopedPackages.includes('a')).toBeTruthy();
        expect(scopedPackages.includes('b')).toBeTruthy();
        expect(scopedPackages.includes('foo')).toBeFalsy();
        expect(scopedPackages.includes('bar')).toBeFalsy();
    }));
    it('can scope with excluded packages', () => __awaiter(void 0, void 0, void 0, function* () {
        const scopedPackages = getScopedPackages_1.getScopedPackages({
            path: repo.rootPath,
            scope: ['!packages/grouped/*'],
        });
        expect(scopedPackages.includes('a')).toBeFalsy();
        expect(scopedPackages.includes('b')).toBeFalsy();
        expect(scopedPackages.includes('foo')).toBeTruthy();
        expect(scopedPackages.includes('bar')).toBeTruthy();
    }));
    it('can mix and match with excluded packages', () => __awaiter(void 0, void 0, void 0, function* () {
        const scopedPackages = getScopedPackages_1.getScopedPackages({
            path: repo.rootPath,
            scope: ['packages/b*', '!packages/grouped/*'],
        });
        expect(scopedPackages.includes('a')).toBeFalsy();
        expect(scopedPackages.includes('b')).toBeFalsy();
        expect(scopedPackages.includes('foo')).toBeFalsy();
        expect(scopedPackages.includes('bar')).toBeTruthy();
    }));
});
//# sourceMappingURL=getScopedPackages.test.js.map