export interface IDecompressTextResult {
    text: string;
    errors: string[];
}
export declare class DynaTextCompress {
    private commonTexts;
    private compressSymbol;
    constructor(commonTexts: string[], forEncode?: boolean, compressSymbol?: string);
    compress(text: string): string;
    decompress(compressedString: string): IDecompressTextResult;
    private variableChars;
    private createChars();
    private encode(partialText);
    private encodeIndex(variableIndex);
    private decodeIndex(compressedBlock);
}
