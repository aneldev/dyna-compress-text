import {
	DynaTextCompress, IDecompressTextResult,
	DynaObjectCompress, IDecompressObjectResult,
	DynaObjectCompressVersion,
} from "../../src";

declare let jest: any, describe: any, expect: any, it: any;

describe('Compress Lorem ipsum text', () => {
	const rawData: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nulla turpis, egestas et ex vitae, tincidunt molestie sem. In vehicula metus eu diam euismod facilisis. Nunc convallis blandit neque ornare euismod. Nulla vel ante sed nisl posuere ornare eget eget sapien. Quisque dapibus aliquet facilisis. Pellentesque volutpat finibus venenatis. Proin mollis pretium felis fringilla faucibus. Suspendisse rutrum posuere convallis. Vestibulum fringilla massa ac efficitur molestie. Nunc nec iaculis magna, ac ornare orci. Suspendisse vel odio sed arcu accumsan faucibus. Phasellus vulputate dui ac nibh mattis, vitae volutpat nibh mattis. ";
	const commonTexts: string[] = rawData.replace(/\./g, " ").replace(/\,/g, " ").replace(/  /g, " ").split(" ");
	const compressor = new DynaTextCompress(commonTexts);
	//const compressText: string = "Aenean nulla turpis, egestas et ex vitae, tincidunt molestie sem.";
	const compressText: string = "Aenean nulla turpis, egestas et ex vitae, tincidunt molestie sem. In vehicula metus eu diam euismod facilisis. Nunc convallis blandit neque ornare euismod.";
	let compressedText: string;
	let decompressedResult: IDecompressTextResult;

	it('should compress', () => {
		console.debug('cccc',compressText);
		debugger;
		compressedText = compressor.compress(compressText);
		expect(compressedText.length < compressText.length).toBe(true);
		console.log('original text', compressText);
		console.log('compressed text', compressedText);
		console.log('original size', compressText.length, 'compressed size', compressedText.length, 'encoded compressed size', encodeURI(compressedText).length);
		console.log('compressed size', (100 * compressedText.length / compressText.length), 'of original');
	});
	it('should decompress', () => {
		decompressedResult = compressor.decompress(compressedText);
		expect(decompressedResult.text).toBe(compressText)
	});
	it('should decompress has no errors', () => {
		decompressedResult = compressor.decompress(compressedText);
		expect(decompressedResult.errors.length).toBe(0)
	});
});

