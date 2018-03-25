import {DynaObjectCompress, IDecompressObjectResult} from "./DynaObjectCompress";

export interface IVersionCompressConfig {
	[version: string]: {
		objectPattern: any,
		commonTexts?: string[]
	}
}

export class DynaObjectCompressVersion {
	private compressors: { [version: string]: DynaObjectCompress } = {};

	constructor(versionCompressConfig: IVersionCompressConfig,
	            forEncode: boolean = true,
	            private compressSymbol: string = "!") {
		Object.keys(versionCompressConfig).forEach((version: string) => {
			if (version.indexOf(compressSymbol) > -1) {
				throw Error(`DynaObjectVCompress: "version" cannot contain the "compressSymbol", version: "${version}"`);
			}
			this.compressors[version] = new DynaObjectCompress(
				versionCompressConfig[version].objectPattern,
				versionCompressConfig[version].commonTexts,
				forEncode,
				compressSymbol,
			);
		})
	}

	public compress(version: string, obj: any): string {
		if (!this.compressors[version]) {
			console.error(`DynaObjectVCompress.compress: ${version} is not supported, there is no versionCompressConfig for this version`);
			return '';
		}
		return `${version}${this.compressSymbol}${this.compressors[version].compress(obj)}`;
	}

	public decompress(compressed: string): IDecompressObjectResult {
		const version: string = compressed.substr(0, compressed.indexOf(this.compressSymbol));
		if (!version) {
			return {
				obj: null,
				errors: ["Cannot get the version from this compressed content"],
			}
		}
		if (!this.compressors[version]) {
			return {
				obj: null,
				errors: [`There is versionCompressConfig for this version: "${version}"`],
			}
		}
		return this.compressors[version].decompress(compressed.substr(compressed.indexOf(this.compressSymbol) + this.compressSymbol.length));
	}
}
