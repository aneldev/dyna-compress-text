import {DynaTextCompress, IDecompressTextResult} from "./DynaTextCompress";

export interface IDecompressObjectResult {
	obj: any,
	errors: string[]
}

export class DynaObjectCompress {
	private textCompressor: DynaTextCompress;

	constructor(objectPattern: any, commonTexts: string[] = [], private forEncode: boolean = true, private compressSymbol: string = "!") {
		this.textCompressor = new DynaTextCompress(
			this.getCommonTexts(objectPattern, commonTexts)
				.concat(
					`true`,
					`true,`,
					`false`,
					`false,`,
					':00:00.000Z"',
					forEncode ? [
						'",',
						'],',
						'"},',
						'"}',
						'"],',
						'"]',
					] : [],
				),
			forEncode,
			compressSymbol,
		);
	}

	public compress(obj: any): string {
		let output: string = this.textCompressor.compress(JSON.stringify(obj));
		if (this.forEncode) {
			output = output
				.replace(/\//g, '_ax5013')
				.replace(/!\\/g, '_bx5013');
		}
		return output;
	}

	public decompress(compressed: string): IDecompressObjectResult {
		if (this.forEncode) {
			compressed = compressed
				.replace("_ax5013", '/')
				.replace("_bx5013", '!\\');
		}
		let obj: any;
		let result: IDecompressTextResult = this.textCompressor.decompress(compressed);
		if (result.errors.length === 0) {
			try {
				obj = JSON.parse(result.text);
			}
			catch (err) {
				return {
					obj: undefined,
					errors: result.errors.concat("Cannot parse to obj"),
				}
			}
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
					if (obj[key] instanceof Date) return `"${key}":"`;
					if (typeof obj[key] === "number") return `"${key}":`;
					if (typeof obj[key] === "boolean") return `"${key}":`;
					if (typeof obj[key] === "object") return `"${key}":{`;
					return `"${key}":"`;
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




