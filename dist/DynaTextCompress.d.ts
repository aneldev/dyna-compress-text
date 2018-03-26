export interface IDecompressTextResult {
    text: string;
    errors: string[];
}
export declare class DynaTextCompress {
    private commonTexts;
    private forEncode;
    private compressSymbol;
    private variableChars;
    constructor(commonTexts: string[], forEncode?: boolean, compressSymbol?: string);
    private initVariableChars();
    private initCommonTexts();
    compress(text: string): string;
    decompress(compressedString: string): IDecompressTextResult;
    private encode(partialText);
    private encodeIndex(variableIndex);
    private decodeIndex(compressedBlock);
}
