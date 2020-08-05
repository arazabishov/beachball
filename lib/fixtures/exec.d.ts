export interface PsResult {
    stderr: string;
    error: Error | null;
    stdout: string;
}
export declare function exec(command: string): Promise<PsResult>;
export declare function runCommands(commands: string[]): Promise<PsResult[]>;
/**
 * @returns The results of the commands run
 */
export declare function runInDirectory(targetDirectory: string, commands: string[]): Promise<PsResult[]>;
//# sourceMappingURL=exec.d.ts.map