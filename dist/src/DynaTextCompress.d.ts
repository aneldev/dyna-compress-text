export interface IDecompressTextResult {
    text: string;
    errors: string[];
}
export declare class DynaTextCompress {
    private commonTexts;
    private compressSymbol;
    constructor(commonTexts: string[], forEncode?: boolean, compressSymbol?: string);
    compress(text: string): string;
    decompress(compressed: string): IDecompressTextResult;
    private getCode(partialText);
    private encodeIndex(index);
    private decodeIndex(text);
}
