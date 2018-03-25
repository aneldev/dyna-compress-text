export interface IDecompressObjResult {
    obj: any;
    errors: string[];
}
export declare class DynaObjectCompressor {
    private textCompressor;
    constructor(objectPattern: any, commonTexts?: string[]);
    compress(obj: any): string;
    decompress(compressed: string): IDecompressObjResult;
    private getCommonTexts(obj, userCommonTexts);
}
