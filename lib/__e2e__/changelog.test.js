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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const repository_1 = require("../fixtures/repository");
const writeChangelog_1 = require("../changelog/writeChangelog");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
const readChangeFiles_1 = require("../changefile/readChangeFiles");
const getPackageChangeTypes_1 = require("../changefile/getPackageChangeTypes");
const monorepo_1 = require("../fixtures/monorepo");
function getChange(partialChange = {}) {
    return Object.assign({ comment: 'comment 1', date: new Date('Thu Aug 22 2019 14:20:40 GMT-0700 (Pacific Daylight Time)'), email: 'test@testtestme.com', packageName: 'foo', type: 'patch', dependentChangeType: 'patch' }, partialChange);
}
function cleanMarkdownForSnapshot(text) {
    return text.replace(/\w\w\w, \d\d \w\w\w [\d :]+?GMT/gm, '(date)');
}
function cleanJsonForSnapshot(changelog) {
    changelog = lodash_1.default.cloneDeep(changelog);
    for (const entry of changelog.entries) {
        entry.date = '(date)';
        for (const changeType of getPackageChangeTypes_1.SortedChangeTypes) {
            if (entry.comments[changeType]) {
                for (const comment of entry.comments[changeType]) {
                    comment.commit = '(sha1)';
                }
            }
        }
    }
    return changelog;
}
describe('changelog generation', () => {
    let repositoryFactory;
    let monoRepoFactory;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        monoRepoFactory = new monorepo_1.MonoRepoFactory();
        yield monoRepoFactory.create();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield repositoryFactory.cleanUp();
        yield monoRepoFactory.cleanUp();
    }));
    describe('readChangeFiles', () => {
        it('adds actual commit hash', () => __awaiter(void 0, void 0, void 0, function* () {
            const repository = yield repositoryFactory.cloneRepository();
            yield repository.commitChange('foo');
            writeChangeFiles_1.writeChangeFiles({ foo: getChange() }, repository.rootPath);
            const currentHash = yield repository.getCurrentHash();
            const changeSet = readChangeFiles_1.readChangeFiles({ path: repository.rootPath });
            const changes = [...changeSet.values()];
            expect(changes).toHaveLength(1);
            expect(changes[0].commit).toBe(currentHash);
        }));
        it('uses hash of original commit', () => __awaiter(void 0, void 0, void 0, function* () {
            const repository = yield repositoryFactory.cloneRepository();
            const changeInfo = getChange();
            yield repository.commitChange('foo');
            const changeFilePaths = writeChangeFiles_1.writeChangeFiles({ foo: changeInfo }, repository.rootPath);
            const changeFilePath = path_1.default.relative(repository.rootPath, changeFilePaths[0]);
            const changeFileAddedHash = yield repository.getCurrentHash();
            // change the change file
            yield repository.commitChange(changeFilePath, JSON.stringify(Object.assign(Object.assign({}, changeInfo), { comment: 'comment 2' }), null, 2));
            yield repository.commitChange(changeFilePath, JSON.stringify(Object.assign(Object.assign({}, changeInfo), { comment: 'comment 3' }), null, 2));
            // keeps original hash
            const changeSet = readChangeFiles_1.readChangeFiles({ path: repository.rootPath });
            const changes = [...changeSet.values()];
            expect(changes).toHaveLength(1);
            expect(changes[0].commit).toBe(changeFileAddedHash);
        }));
    });
    describe('writeChangelog', () => {
        it('generates correct changelog', () => __awaiter(void 0, void 0, void 0, function* () {
            const repository = yield repositoryFactory.cloneRepository();
            yield repository.commitChange('foo');
            writeChangeFiles_1.writeChangeFiles({ foo: getChange() }, repository.rootPath);
            yield repository.commitChange('bar');
            writeChangeFiles_1.writeChangeFiles({ foo: getChange({ comment: 'comment 2' }) }, repository.rootPath);
            const beachballOptions = { path: repository.rootPath };
            const changes = readChangeFiles_1.readChangeFiles(beachballOptions);
            // Gather all package info from package.json
            const packageInfos = getPackageInfos_1.getPackageInfos(repository.rootPath);
            yield writeChangelog_1.writeChangelog(beachballOptions, changes, packageInfos);
            const changelogFile = path_1.default.join(repository.rootPath, 'CHANGELOG.md');
            const text = yield fs_extra_1.default.readFile(changelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(text)).toMatchSnapshot();
            const changelogJsonFile = path_1.default.join(repository.rootPath, 'CHANGELOG.json');
            const jsonText = yield fs_extra_1.default.readFile(changelogJsonFile, { encoding: 'utf-8' });
            const changelogJson = JSON.parse(jsonText);
            expect(cleanJsonForSnapshot(changelogJson)).toMatchSnapshot();
        }));
        it('generates correct grouped changelog', () => __awaiter(void 0, void 0, void 0, function* () {
            const monoRepo = yield monoRepoFactory.cloneRepository();
            yield monoRepo.commitChange('foo');
            writeChangeFiles_1.writeChangeFiles({ foo: getChange() }, monoRepo.rootPath);
            yield monoRepo.commitChange('bar');
            writeChangeFiles_1.writeChangeFiles({ bar: getChange({ packageName: 'bar', comment: 'comment 2' }) }, monoRepo.rootPath);
            writeChangeFiles_1.writeChangeFiles({ bar: getChange({ packageName: 'bar', comment: 'comment 3' }) }, monoRepo.rootPath);
            const beachballOptions = {
                path: monoRepo.rootPath,
                changelog: {
                    groups: [
                        {
                            masterPackageName: 'foo',
                            changelogPath: monoRepo.rootPath,
                            include: ['packages/foo', 'packages/bar'],
                        },
                    ],
                },
            };
            const changes = readChangeFiles_1.readChangeFiles(beachballOptions);
            // Gather all package info from package.json
            const packageInfos = getPackageInfos_1.getPackageInfos(monoRepo.rootPath);
            yield writeChangelog_1.writeChangelog(beachballOptions, changes, packageInfos);
            // Validate changelog for foo package
            const fooChangelogFile = path_1.default.join(monoRepo.rootPath, 'packages', 'foo', 'CHANGELOG.md');
            const fooChangelogText = yield fs_extra_1.default.readFile(fooChangelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(fooChangelogText)).toMatchSnapshot();
            // Validate changelog for bar package
            const barChangelogFile = path_1.default.join(monoRepo.rootPath, 'packages', 'bar', 'CHANGELOG.md');
            const barChangelogText = yield fs_extra_1.default.readFile(barChangelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(barChangelogText)).toMatchSnapshot();
            // Validate grouped changelog for foo and bar packages
            const groupedChangelogFile = path_1.default.join(monoRepo.rootPath, 'CHANGELOG.md');
            const groupedChangelogText = yield fs_extra_1.default.readFile(groupedChangelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(groupedChangelogText)).toMatchSnapshot();
        }));
        it('generates correct grouped changelog when grouped change log is saved to the same dir as a regular changelog', () => __awaiter(void 0, void 0, void 0, function* () {
            const monoRepo = yield monoRepoFactory.cloneRepository();
            yield monoRepo.commitChange('foo');
            writeChangeFiles_1.writeChangeFiles({ foo: getChange() }, monoRepo.rootPath);
            yield monoRepo.commitChange('bar');
            writeChangeFiles_1.writeChangeFiles({ bar: getChange({ packageName: 'bar', comment: 'comment 2' }) }, monoRepo.rootPath);
            const beachballOptions = {
                path: monoRepo.rootPath,
                changelog: {
                    groups: [
                        {
                            masterPackageName: 'foo',
                            changelogPath: path_1.default.join(monoRepo.rootPath, 'packages', 'foo'),
                            include: ['packages/foo', 'packages/bar'],
                        },
                    ],
                },
            };
            const changes = readChangeFiles_1.readChangeFiles(beachballOptions);
            // Gather all package info from package.json
            const packageInfos = getPackageInfos_1.getPackageInfos(monoRepo.rootPath);
            yield writeChangelog_1.writeChangelog(beachballOptions, changes, packageInfos);
            // Validate changelog for bar package
            const barChangelogFile = path_1.default.join(monoRepo.rootPath, 'packages', 'bar', 'CHANGELOG.md');
            const barChangelogText = yield fs_extra_1.default.readFile(barChangelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(barChangelogText)).toMatchSnapshot();
            // Validate grouped changelog for foo and bar packages
            const groupedChangelogFile = path_1.default.join(monoRepo.rootPath, 'packages', 'foo', 'CHANGELOG.md');
            const groupedChangelogText = yield fs_extra_1.default.readFile(groupedChangelogFile, { encoding: 'utf-8' });
            expect(cleanMarkdownForSnapshot(groupedChangelogText)).toMatchSnapshot();
        }));
    });
});
//# sourceMappingURL=changelog.test.js.map