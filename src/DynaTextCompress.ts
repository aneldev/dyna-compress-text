export interface IDecompressTextResult {
	text: string,
	errors: string[]
}

export class DynaTextCompress {
	constructor(private  commonTexts: string[], forEncode: boolean = true, private compressSymbol: string = "!") {
		this.commonTexts = commonTexts.concat();
		if (forEncode) this.commonTexts = this.commonTexts.concat([
			' ',
			'`',
			'"',
			',',
			';',
			'{',
			'},',
			'}',
			'[',
			']',
			'/',
			'\\',
			'\n',
			'\r',
			'\t',
		]);
		this.commonTexts =
			this.commonTexts
				.filter((text: string) => text !== compressSymbol)
				.filter((text: string) => !!text)
				.sort((textA: string, textB: string) => textA.length - textB.length)
				.reverse();
		this.commonTexts.unshift(this.compressSymbol);
		this.createChars();
	}

	public compress(text: string): string {
		let output: string = '';
		for (let iChar: number = 0; iChar < text.length; iChar++) {
			let compressedBlock = this.encode(text.substr(iChar));
			if (compressedBlock) {
				output += compressedBlock;
				iChar += (this.commonTexts[this.decodeIndex(compressedBlock)]).length - 1;
			} else {
				output += text[iChar];
			}
		}
		return output;
	}

	public decompress(compressedString: string): IDecompressTextResult {
		let output: IDecompressTextResult = {
			text: '',
			errors: [],
		};
		for (let iChar = 0; iChar < compressedString.length; iChar++) {
			if (compressedString[iChar] === this.compressSymbol) {
				const compressedBlock = compressedString.substr(iChar, 2);
				let decodedText = this.commonTexts[this.decodeIndex(compressedBlock)];
				if (decodedText) {
					output.text += decodedText;
				}
				else {
					output.errors.push(`Symbol [${compressedBlock}] in unknown`);
				}
				iChar += 1;
			}
			else {
				output.text += compressedString[iChar];
			}
		}
		return output;
	}

	// ---------- internals

	private variableChars: string = "";

	private createChars(): void {
		const charsSetup: any = [
			[48, 57],
			[65, 90],
			[97, 122],
			[128, 254],
		];

		charsSetup.forEach((set) => {
			for (let i = set[0]; i <= set[1]; i++) this.variableChars += String.fromCharCode(i);
		});
	}

	private encode(partialText: string): string {
		let output = null;
		this.commonTexts.forEach((word, index) => {
			if (output) return;
			if (partialText.substr(0, word.length) === word) {
				output = this.encodeIndex(index);
			}
		});
		return output;
	}

	private encodeIndex(variableIndex: number): string {
		let variableChar: string;
		if (variableIndex < this.variableChars.length) {
			variableChar = this.variableChars[variableIndex];
		}
		else {
			variableChar = String.fromCharCode(256 + variableIndex);
		}
		return this.compressSymbol + variableChar;
	}

	private decodeIndex(compressedBlock: string): number {
		let variableIndex: number = compressedBlock.charCodeAt(1);
		let indexInVariableChars: number = this.variableChars.indexOf(String.fromCharCode(variableIndex));
		if (indexInVariableChars > -1) {
			return indexInVariableChars;
		}
		else {
			return variableIndex - 256;
		}
	}

}





