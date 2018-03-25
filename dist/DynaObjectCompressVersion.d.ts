import { IDecompressObjectResult } from "./DynaObjectCompress";
export interface IVersionCompressConfig {
    [version: string]: {
        objectPattern: any;
        commonTexts?: string[];
    };
}
export declare class DynaObjectCompressVersion {
    private compressSymbol;
    private compressors;
    constructor(versionCompressConfig: IVersionCompressConfig, forEncode?: boolean, compressSymbol?: string);
    compress(version: string, obj: any): string;
    decompress(compressed: string): IDecompressObjectResult;
}
