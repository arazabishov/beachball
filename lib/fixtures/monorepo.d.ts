import { RepositoryFactory } from './repository';
import { PackageJson } from '../types/PackageInfo';
export declare const packageJsonFixtures: {
    [path: string]: PackageJson;
};
export declare class MonoRepoFactory extends RepositoryFactory {
    root?: string;
    create(): Promise<void>;
}
//# sourceMappingURL=monorepo.d.ts.map