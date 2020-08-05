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
const fs_extra_1 = __importDefault(require("fs-extra"));
const repository_1 = require("../fixtures/repository");
const writeChangeFiles_1 = require("../changefile/writeChangeFiles");
const git_1 = require("../git");
const bump_1 = require("../commands/bump");
const getPackageInfos_1 = require("../monorepo/getPackageInfos");
const paths_1 = require("../paths");
const monorepo_1 = require("../fixtures/monorepo");
describe('version bumping', () => {
    let repositoryFactory;
    function getChangeFiles(cwd) {
        const changePath = paths_1.getChangePath(cwd);
        const changeFiles = changePath && fs_extra_1.default.existsSync(changePath) ? fs_extra_1.default.readdirSync(changePath) : [];
        return changeFiles;
    }
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (repositoryFactory) {
            repositoryFactory.cleanUp();
            repositoryFactory = undefined;
        }
    }));
    it('bumps only packages with change files', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/pkg-1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
            dependencies: {
                'pkg-1': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
            devDependencies: {
                'pkg-2': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-4/package.json', JSON.stringify({
            name: 'pkg-4',
            version: '1.0.0',
            peerDependencies: {
                'pkg-3': '1.0.0',
            },
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            'pkg-1': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'pkg-1',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: false });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].version).toBe('1.0.0');
        expect(packageInfos['pkg-3'].version).toBe('1.0.0');
        expect(packageInfos['pkg-2'].dependencies['pkg-1']).toBe('1.1.0');
        expect(packageInfos['pkg-3'].devDependencies['pkg-2']).toBe('1.0.0');
        expect(packageInfos['pkg-4'].peerDependencies['pkg-3']).toBe('1.0.0');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(0);
    }));
    it('bumps only packages with change files committed between specified ref and head using `since` flag', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/pkg-1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
            dependencies: {
                'pkg-1': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            'pkg-1': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'pkg-1',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        const revParseOutput = git_1.git(['rev-parse', 'HEAD'], { cwd: repo.rootPath });
        if (!revParseOutput.success) {
            fail('failed to retrieve the HEAD SHA');
        }
        writeChangeFiles_1.writeChangeFiles({
            'pkg-3': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-02'),
                email: 'test@test.com',
                packageName: 'pkg-3',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: false, fromRef: revParseOutput.stdout });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.0.0');
        expect(packageInfos['pkg-2'].version).toBe('1.0.0');
        expect(packageInfos['pkg-3'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].dependencies['pkg-1']).toBe('1.0.0');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(1);
    }));
    it('bumps all dependent packages with `bumpDeps` flag', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/pkg-1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
            dependencies: {
                'pkg-1': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
            devDependencies: {
                'pkg-2': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-4/package.json', JSON.stringify({
            name: 'pkg-4',
            version: '1.0.0',
            peerDependencies: {
                'pkg-3': '1.0.0',
            },
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            'pkg-1': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'pkg-1',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: true });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].version).toBe('1.0.1');
        expect(packageInfos['pkg-3'].version).toBe('1.0.1');
        expect(packageInfos['pkg-2'].dependencies['pkg-1']).toBe('1.1.0');
        expect(packageInfos['pkg-3'].devDependencies['pkg-2']).toBe('1.0.1');
        expect(packageInfos['pkg-4'].peerDependencies['pkg-3']).toBe('1.0.1');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(0);
    }));
    it('bumps all grouped packages', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/pkg-1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
        }));
        yield repo.commitChange('unrelated/pkg-4/package.json', JSON.stringify({
            name: 'pkg-4',
            version: '1.0.0',
        }));
        writeChangeFiles_1.writeChangeFiles({
            'pkg-1': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'pkg-1',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, groups: [{ include: 'packages/*', name: 'testgroup' }] });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].version).toBe('1.1.0');
        expect(packageInfos['pkg-3'].version).toBe('1.1.0');
        expect(packageInfos['pkg-4'].version).toBe('1.0.0');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(0);
    }));
    it('bumps all grouped AND dependent packages', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/grp/1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/grp/2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/grp/3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
            dependencies: {
                commonlib: '1.0.0',
            },
        }));
        yield repo.commitChange('packages/commonlib/package.json', JSON.stringify({
            name: 'commonlib',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/app/package.json', JSON.stringify({
            name: 'app',
            version: '1.0.0',
            dependencies: {
                'pkg-1': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/unrelated/package.json', JSON.stringify({
            name: 'unrelated',
            version: '1.0.0',
        }));
        writeChangeFiles_1.writeChangeFiles({
            commonlib: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'commonlib',
                dependentChangeType: 'minor',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({
            path: repo.rootPath,
            groups: [{ include: 'packages/grp/*', name: 'grp' }],
            bumpDeps: true,
        });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].version).toBe('1.1.0');
        expect(packageInfos['pkg-3'].version).toBe('1.1.0');
        expect(packageInfos['commonlib'].version).toBe('1.1.0');
        expect(packageInfos['app'].version).toBe('1.1.0');
        expect(packageInfos['unrelated'].version).toBe('1.0.0');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(0);
    }));
    it('should not bump out-of-scope package even if package has change', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new monorepo_1.MonoRepoFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        writeChangeFiles_1.writeChangeFiles({
            foo: {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'foo',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: true, scope: ['!packages/foo'] });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['foo'].version).toBe('1.0.0');
        expect(packageInfos['bar'].version).toBe('1.3.4');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(1);
    }));
    it('should not bump out-of-scope package even if dependency of the package has change', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        repositoryFactory = new monorepo_1.MonoRepoFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        writeChangeFiles_1.writeChangeFiles({
            bar: {
                type: 'patch',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'bar',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: true, scope: ['!packages/foo'] });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['foo'].version).toBe('1.0.0');
        expect(packageInfos['bar'].version).toBe('1.3.5');
        expect((_a = packageInfos['foo'].dependencies) === null || _a === void 0 ? void 0 : _a.bar).toBe('^1.3.5');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(0);
    }));
    it('bumps all packages and keeps change files with `keep-change-files` flag', () => __awaiter(void 0, void 0, void 0, function* () {
        repositoryFactory = new repository_1.RepositoryFactory();
        yield repositoryFactory.create();
        const repo = yield repositoryFactory.cloneRepository();
        yield repo.commitChange('packages/pkg-1/package.json', JSON.stringify({
            name: 'pkg-1',
            version: '1.0.0',
        }));
        yield repo.commitChange('packages/pkg-2/package.json', JSON.stringify({
            name: 'pkg-2',
            version: '1.0.0',
            dependencies: {
                'pkg-1': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-3/package.json', JSON.stringify({
            name: 'pkg-3',
            version: '1.0.0',
            devDependencies: {
                'pkg-2': '1.0.0',
            },
        }));
        yield repo.commitChange('packages/pkg-4/package.json', JSON.stringify({
            name: 'pkg-4',
            version: '1.0.0',
            peerDependencies: {
                'pkg-3': '1.0.0',
            },
        }));
        yield repo.commitChange('package.json', JSON.stringify({
            name: 'foo-repo',
            version: '1.0.0',
            private: true,
        }));
        writeChangeFiles_1.writeChangeFiles({
            'pkg-1': {
                type: 'minor',
                comment: 'test',
                date: new Date('2019-01-01'),
                email: 'test@test.com',
                packageName: 'pkg-1',
                dependentChangeType: 'patch',
            },
        }, repo.rootPath);
        git_1.git(['push', 'origin', 'master'], { cwd: repo.rootPath });
        yield bump_1.bump({ path: repo.rootPath, bumpDeps: false, keepChangeFiles: true });
        const packageInfos = getPackageInfos_1.getPackageInfos(repo.rootPath);
        expect(packageInfos['pkg-1'].version).toBe('1.1.0');
        expect(packageInfos['pkg-2'].version).toBe('1.0.0');
        expect(packageInfos['pkg-3'].version).toBe('1.0.0');
        expect(packageInfos['pkg-2'].dependencies['pkg-1']).toBe('1.1.0');
        expect(packageInfos['pkg-3'].devDependencies['pkg-2']).toBe('1.0.0');
        expect(packageInfos['pkg-4'].peerDependencies['pkg-3']).toBe('1.0.0');
        const changeFiles = getChangeFiles(repo.rootPath);
        expect(changeFiles.length).toBe(1);
    }));
});
//# sourceMappingURL=bump.test.js.map