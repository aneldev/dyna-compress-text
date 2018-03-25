import {DynaTextCompress, IDecompressTextResult} from "./DynaTextCompress";

export interface IDecompressObjectResult {
	obj: any,
	errors: string[]
}

export class DynaObjectCompress {
	private textCompressor: DynaTextCompress;

	constructor(objectPattern: any, commonTexts: string[] = [], forEncode: boolean = true, private compressSymbol: string = "!") {
		this.textCompressor = new DynaTextCompress(
			this.getCommonTexts(objectPattern, commonTexts)
				.concat(
					forEncode ? [
						'",',
						'{',
						'"},',
						'},',
						'}',
						'[',
						'"],',
						'],',
						'}',
					] : [],
				),
			forEncode,
			compressSymbol,
		);
	}

	public compress(obj: any): string {
		return this.textCompressor.compress(JSON.stringify(obj));
	}

	public decompress(compressed: string): IDecompressObjectResult {
		let obj: any;
		let result: IDecompressTextResult = this.textCompressor.decompress(compressed);
		if (result.errors.length === 0) {
			obj = JSON.parse(result.text);
		}
		return {
			obj,
			errors: result.errors,
		}
	}

	private getCommonTexts(obj: any, userCommonTexts: string[]): string[] {
		let commonTexts: string[] = [];

		const _getProperties = (obj) => {
			if (obj == null) return;
			else if (obj instanceof Date) return;
			else if (Array.isArray(obj)) obj.forEach(_getProperties);
			else if (typeof obj === "object") {
				commonTexts = commonTexts.concat(Object.keys(obj).map((key: string) => {
					if (Array.isArray(obj[key])) return `"${key}":[`;
					if (typeof obj[key] !== "number") return `"${key}":"`;
					return `"${key}":`;
				}));
				Object.keys(obj).forEach((key) => _getProperties(obj[key]));
			}
		};
		_getProperties(obj);

		return commonTexts
			.concat(userCommonTexts)
			.reduce((acc: string[], text: string) => {
				if (acc.indexOf(text) === -1) acc.push(text);
				return acc;
			}, [])
			.sort((aText: string, bText: string) => aText.length - bText.length)
			.reverse();
	}
}




