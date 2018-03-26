export interface IDecompressObjectResult {
    obj: any;
    errors: string[];
}
export declare class DynaObjectCompress {
    private forEncode;
    private compressSymbol;
    private textCompressor;
    constructor(objectPattern: any, commonTexts?: string[], forEncode?: boolean, compressSymbol?: string);
    compress(obj: any): string;
    decompress(compressed: string): IDecompressObjectResult;
    private getCommonTexts(obj, userCommonTexts);
}
