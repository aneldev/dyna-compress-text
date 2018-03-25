export interface IDecompressTextResult {
	text: string,
	errors: string[]
}

export class DynaTextCompress {
	constructor(private  commonTexts: string[], forEncode: boolean = true, private compressSymbol: string = "!") {
		this.commonTexts = commonTexts.concat();
		this.commonTexts.unshift(this.compressSymbol);
		if (forEncode) this.commonTexts.push(" ");
		this.commonTexts =
			this.commonTexts
				.sort((aText: string, bText: string) => aText.length - bText.length)
				.reverse();
	}

	public compress(text: string): string {
		let output: string = '';
		for (let iChar: number = 0; iChar < text.length; iChar++) {
			let code = this.getCode(text.substr(iChar));
			if (code) {
				output += code;
				iChar += (this.commonTexts[this.decodeIndex(code)]).length - 1;
			} else {
				output += text[iChar];
			}
		}
		return output;
	}

	public decompress(compressed: string): IDecompressTextResult {
		let output: IDecompressTextResult = {
			text: '',
			errors: [],
		};
		for (let iChar = 0; iChar < compressed.length; iChar++) {
			if (compressed[iChar] === this.compressSymbol) {
				const compressedSymbol = compressed.substr(iChar, 2);
				let decodedText = this.commonTexts[this.decodeIndex(compressedSymbol)];
				if (decodedText) {
					output.text += decodedText;
				}
				else {
					output.errors.push(`Symbol [${compressedSymbol}] in unknown`);
				}
				iChar += 1;
			}
			else {
				output.text += compressed[iChar];
			}
		}
		return output;
	}

	private getCode(partialText: string): string {
		let output = null;
		this.commonTexts.forEach((word, index) => {
			if (output) return;
			if (partialText.substr(0, word.length) === word) {
				output = this.encodeIndex(index);
			}
		});
		return output;
	}

	private encodeIndex(index: number): string {
		return this.compressSymbol + String.fromCharCode(65 + index);
	}

	private decodeIndex(text: string): number {
		return text.charCodeAt(1) - 65;
	}

}





