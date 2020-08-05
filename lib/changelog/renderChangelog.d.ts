import { ChangelogOptions, PackageChangelogRenderInfo } from '../types/ChangelogOptions';
export interface MarkdownChangelogRenderOptions extends Omit<PackageChangelogRenderInfo, 'renderers'> {
    previousContent: string;
    changelogOptions: ChangelogOptions;
}
export declare const markerComment = "<!-- Start content -->";
export declare function renderChangelog(renderOptions: MarkdownChangelogRenderOptions): Promise<string>;
//# sourceMappingURL=renderChangelog.d.ts.map