export interface IDecompressTextResult {
    text: string;
    errors: string[];
}
export declare class DynaCompressText {
    private commonTests;
    private compressSymbol;
    constructor(commonTests: string[], compressSymbol?: string);
    compress(text: string): string;
    decompress(compressed: string): IDecompressTextResult;
    private getCode(partialText);
    private encodeIndex(index);
    private decodeIndex(text);
}
