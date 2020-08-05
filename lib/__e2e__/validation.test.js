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
const repository_1 = require("../fixtures/repository");
const isChangeFileNeeded_1 = require("../validation/isChangeFileNeeded");
describe('validation', () => {
    let repositoryFactory;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield repositoryFactory.cleanUp();
    }));
    describe('isChangeFileNeeded', () => {
        let repository;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            repository = yield repositoryFactory.cloneRepository();
        }));
        it('is false when no changes have been made', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = isChangeFileNeeded_1.isChangeFileNeeded({
                branch: 'origin/master',
                path: repository.rootPath,
                fetch: false,
            });
            expect(result).toBeFalsy();
        }));
        it('is true when changes exist in a new branch', () => __awaiter(void 0, void 0, void 0, function* () {
            yield repository.branch('feature-0');
            yield repository.commitChange('myFilename');
            const result = isChangeFileNeeded_1.isChangeFileNeeded({
                branch: 'origin/master',
                path: repository.rootPath,
                fetch: false,
            });
            expect(result).toBeTruthy();
        }));
        it('is false when changes are CHANGELOG files', () => __awaiter(void 0, void 0, void 0, function* () {
            yield repository.branch('feature-0');
            yield repository.commitChange('CHANGELOG.md');
            const result = isChangeFileNeeded_1.isChangeFileNeeded({
                branch: 'origin/master',
                path: repository.rootPath,
                fetch: false,
            });
            expect(result).toBeFalsy();
        }));
        it('throws if the remote is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield repository.setRemoteUrl('origin', 'file:///__nonexistent');
            yield repository.branch('feature-0');
            yield repository.commitChange('CHANGELOG.md');
            expect(() => {
                isChangeFileNeeded_1.isChangeFileNeeded({
                    branch: 'origin/master',
                    path: repository.rootPath,
                    fetch: true,
                });
            }).toThrow();
        }));
    });
});
//# sourceMappingURL=validation.test.js.map