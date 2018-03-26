import {
	DynaTextCompress, IDecompressTextResult,
	DynaObjectCompress, IDecompressObjectResult,
	DynaObjectCompressVersion,
} from "../../src";

declare let jest: any, describe: any, expect: any, it: any;

describe('Compress short text', () => {
	const compressor = new DynaTextCompress(["roundTripType"]);
	const shortTestString: string = "roundTripType";
	let compressedString: string;
	let decompressedResult: IDecompressTextResult;

	it('should compress', () => {
		compressedString = compressor.compress(shortTestString);
		expect(compressedString.length < shortTestString.length).toBe(true);
	});
	it('should decompress', () => {
		decompressedResult = compressor.decompress(compressedString);
		expect(decompressedResult.text).toBe(shortTestString)
	});
	it('should decompress has no errors', () => {
		decompressedResult = compressor.decompress(compressedString);
		expect(decompressedResult.errors.length).toBe(0)
	});
});

describe('Compress long text', () => {
	const commonTexts = [
		`"roundTripType":`,
		`"MULTI_TRIP",`,
		`"RETURN",`,
		`"ONE_WAY,"`,
		`"routes":`,
		`"origin":`,
		`"type":`,
		`"AIRPORT",`,
		`"name":`,
		`"date":`,
		`"text":`,
		`"city":`,
		`"country":`,
		`"tripClass":`,
		`"codeName":`,
		`"destination":`,
		`"departDate":`,
		`"transports":`,
		`"currency":`,
		`"directOnly":`,
		`"AIRPLANE",`,
		`"AIRPLANE"`,
		`"AIRPORT",,`,
		`"ECONOMY",`,
		`"BUSINESS",`,
		`"passengers":`,
		`"ADULT",`,
		`"ADULT"`,
		`"CHILD",`,
		`"CHILD"`,
		`"INFANT",`,
		`"INFANT"`,
		`true,`,
		`false,`,
		`"userIpAddress":`,
		`"127.0.0.1",`,
		`"127.0.0.1"`,
		`}}},`
	];
	const compressor = new DynaTextCompress(commonTexts);
	const longTestString: string = `{"roundTripType":"MULTI_TRIP","name":"$ak","routes":[{"origin":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Schwechat"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"destination":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles Intl"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"departDate":{"date":"2018-03-09T23:00:00.000Z"}},{"origin":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles Intl"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"destination":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Schwechat"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"departDate":{"date":"2018-03-09T23:00:00.000Z"}},{"origin":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Schwechat"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"destination":{"type":"AIRPORT","name":{"codeName":"YQB","name":{"text":"Quebec Jean Lesage Intl"}},"city":{"name":{"text":"Quebec"}},"country":{"name":{"text":"Canada"}}},"departDate":{"date":"2018-03-09T23:00:00.000Z"}}],"directOnly":false,"currency":"USD","transports":["AIRPLANE"],"tripClass":"ECONOMY","passengers":[{"type":"ADULT"}],"userIpAddress":"127.0.0.1"}`;
	let compressedString: string;
	let decompressedResult: IDecompressTextResult;

	it('should compress', () => {
		compressedString = compressor.compress(longTestString);
		expect(compressedString.length < longTestString.length).toBe(true);
	});
	it('should decompress', () => {
		decompressedResult = compressor.decompress(compressedString);
		expect(decompressedResult.text).toBe(longTestString)
	});
	it('should decompress has no errors', () => {
		decompressedResult = compressor.decompress(compressedString);
		expect(decompressedResult.errors.length).toBe(0)
	});
});

describe('Compress small text (stringified object)', () => {
	const data: any = {firstName: "John", lastName: "Smith", age: 32, nationality: "Australian", car: "VW!"};
	const commonTexts: string[] = [
		'"firstName":"',
		'"lastName":"',
		'"age":',
		'"nationality":"',
		'"car":"',
		'",',
		'"}',
		'{',
	];
	const myCompressor = new DynaTextCompress(commonTexts);
	let stringifiedObject: string = JSON.stringify(data);
	let compressedText: string;

	it('should compress', () => {
		compressedText = myCompressor.compress(stringifiedObject);
		expect(compressedText.length < stringifiedObject.length).toBe(true);
		console.log('compressed text', compressedText);
		console.log('original size', stringifiedObject.length, 'compressed size', compressedText.length, 'encoded compressed size', encodeURI(compressedText).length);
		console.log('compressed size', (100 * compressedText.length / stringifiedObject.length), 'of original');
	});

	it('should decompress', () => {
		const deCompressedText = myCompressor.decompress(compressedText);
		expect(deCompressedText.errors.length).toBe(0);
		expect(deCompressedText.text).toBe(stringifiedObject);
	});
});

describe('Compress object', () => {
	const dataPattern: any = {
		firstName: "s",
		lastName: "s",
		age: 0,
		nationality: "s",
		cars: [
			{brand: "s", bought: new Date, kilometers: 0},
			{brand: "s", bought: new Date, kilometers: 0},
		]
	};
	const data: any = {
		firstName: "John",
		lastName: "Smith",
		age: 32,
		nationality: "Australian",
		cars: [
			{brand: "VW", bought: new Date("2017-02-02"), kilometers: 12000},
			{brand: "Audi a4", bought: new Date("2018-02-02"), kilometers: 2000},
		]
	};
	const commonTexts: string[] = [
		"Australian",
		"Audi",
		"T00:00:00.000Z",
		"000",
	];
	const myCompressor = new DynaObjectCompress(dataPattern, commonTexts);
	let stringifiedObject: string = JSON.stringify(data);
	let compressedText: string;

	it('should compress', () => {
		compressedText = myCompressor.compress(data);
		expect(compressedText.length < stringifiedObject.length).toBe(true);
		console.log('compressed text', compressedText);
		console.log('original size', stringifiedObject.length, 'compressed size', compressedText.length, 'encoded compressed size', encodeURI(compressedText).length);
		console.log('compressed size', (100 * compressedText.length / stringifiedObject.length), 'of original');
	});

	it('should not contain property names', () => {
		expect(compressedText.indexOf('firstName')).toBe(-1);
		expect(compressedText.indexOf('kilometers')).toBe(-1);
	});

	it('should not contain common texts', () => {
		expect(compressedText.indexOf('Australian')).toBe(-1);
		expect(compressedText.indexOf('Audi')).toBe(-1);
	});

	it('should decompress', () => {
		const decompressResult: IDecompressObjectResult = myCompressor.decompress(compressedText);
		expect(decompressResult.errors.length).toBe(0);
		expect(decompressResult.obj.firstName).toBe("John");
		expect(decompressResult.obj.cars[1].kilometers).toBe(2000);
	});
});

describe('Compress bigger object', () => {
	const dataPattern: any = {"roundTripType":"RETURN","routes":[{"origin":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Vienna International Airport"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"destination":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles International Airport"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"departDate":{"date":"2018-03-29T22:00:00.000Z"}},{"origin":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles International Airport"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"destination":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Vienna International Airport"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"departDate":{"date":"2018-03-31T22:00:00.000Z"}}],"directOnly":false,"transports":["AIRPLANE"],"tripClass":"ECONOMY","passengers":[{"type":"ADULT"}],"userIpAddress":"127.0.0.1","un":"0.69791"};
	const data: any = {"roundTripType":"RETURN","routes":[{"origin":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Vienna International Airport"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"destination":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles International Airport"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"departDate":{"date":"2018-03-29T22:00:00.000Z"}},{"origin":{"type":"AIRPORT","name":{"codeName":"LAX","name":{"text":"Los Angeles International Airport"}},"city":{"name":{"text":"Los Angeles"}},"country":{"name":{"text":"United States"}}},"destination":{"type":"AIRPORT","name":{"codeName":"VIE","name":{"text":"Vienna International Airport"}},"city":{"name":{"text":"Vienna"}},"country":{"name":{"text":"Austria"}}},"departDate":{"date":"2018-03-31T22:00:00.000Z"}}],"directOnly":false,"transports":["AIRPLANE"],"tripClass":"ECONOMY","passengers":[{"type":"ADULT"}],"userIpAddress":"127.0.0.1","un":"0.69791"};
	const commonTexts: string[] = [
		`"127.0.0.1",`,
		`RETURN`,
		`ONE_WAY`,
		`MULTI_TRIP`,
		`AIRPLANE`,
		`AIRPORT`,
		`ECONOMY`,
		`BUSINESS`,
		`ADULT`,
		`CHILD`,
		`INFANT`,
		`Airport`,
		`airport`,
		`International`,
		`international`,
		`United`,
	];
	const myCompressor = new DynaObjectCompress(dataPattern, commonTexts);
	let stringifiedObject: string = JSON.stringify(data);
	let compressedText: string;

	it('should compress', () => {
		compressedText = myCompressor.compress(data);
		expect(compressedText.length < stringifiedObject.length).toBe(true);
		console.log('compressed text', compressedText);
		console.log('original size', stringifiedObject.length, 'compressed size', compressedText.length, 'encoded compressed size', encodeURI(compressedText).length);
		console.log('compressed size', (100 * compressedText.length / stringifiedObject.length), 'of original');
	});

	it('should not contain property names', () => {
		expect(compressedText.indexOf('name')).toBe(-1);
		expect(compressedText.indexOf('routes')).toBe(-1);
		expect(compressedText.indexOf('date2')).toBe(-1);
	});

	it('should not contain common texts', () => {
		expect(compressedText.indexOf('ADULT')).toBe(-1);
		expect(compressedText.indexOf('BUSINESS')).toBe(-1);
	});

	it('should not contain the / char', () => {
		expect(compressedText.indexOf('/')).toBe(-1);
	});

	it('should decompress', () => {
		const decompressResult: IDecompressObjectResult = myCompressor.decompress(compressedText);
		expect(decompressResult.errors.length).toBe(0);
		expect(decompressResult.obj.userIpAddress).toBe("127.0.0.1");
		expect(decompressResult.obj.un).toBe("0.69791");
	});
});

describe('Compress object by version', () => {
	const dataPatternV1: any = {
		firstName: "s",
		lastName: "s",
		age: 0,
		nationality: "s",
	};
	const dataPatternV2: any = {
		firstName: "s",
		lastName: "s",
		age: 0,
		nationality: "s",
		cars: [
			{brand: "s", bought: new Date, kilometers: 0},
			{brand: "s", bought: new Date, kilometers: 0},
		]
	};
	const dataV1: any = {
		firstName: "John",
		lastName: "Smith",
		age: 32,
		nationality: "Australian",
	};
	const dataV2: any = {
		firstName: "Lola",
		lastName: "James",
		age: 34,
		nationality: "French",
		cars: [
			{brand: "Lotus", bought: new Date("2017-02-02"), kilometers: 2000},
		]
	};
	const commonTexts: string[] = [
		"Australian",
		"Audi",
		"Lotus",
		"T00:00:00.000Z",
		"000",
	];

	const myCompressor = new DynaObjectCompressVersion(
		{
			v1: {
				objectPattern: dataPatternV1,
				commonTexts,
			},
			v2: {
				objectPattern: dataPatternV2,
				commonTexts,
			},
		},
	);
	// stringify the data to compare, we don't need them in real world
	let stringifiedObjectV1: string = JSON.stringify(dataV1);
	let stringifiedObjectV2: string = JSON.stringify(dataV2);
	let compressedTextV1: string;
	let compressedTextV2: string;

	it('v1 - should compress', () => {
		compressedTextV1 = myCompressor.compress("v1", dataV1);
		expect(compressedTextV1.length < stringifiedObjectV1.length).toBe(true);
		console.log('v1 - compressed text', compressedTextV1);
		console.log('v1 - original size', stringifiedObjectV1.length, 'compressed size', compressedTextV1.length);
		console.log('v1 - compressed size', (100 * compressedTextV1.length / stringifiedObjectV1.length), 'of original');
	});

	it('v1 - should not contain property names', () => {
		expect(compressedTextV1.indexOf('firstName')).toBe(-1);
		expect(compressedTextV1.indexOf('kilometers')).toBe(-1);
	});

	it('v1 - should not contain common texts', () => {
		expect(compressedTextV1.indexOf('Australian')).toBe(-1);
		expect(compressedTextV1.indexOf('Audi')).toBe(-1);
	});

	it('v1 - should decompress', () => {
		const decompressResult: IDecompressObjectResult = myCompressor.decompress(compressedTextV1);
		expect(decompressResult.errors.length).toBe(0);
		expect(decompressResult.obj.firstName).toBe("John");
	});

	it('v2 - should compress', () => {
		compressedTextV2 = myCompressor.compress("v2", dataV2);
		expect(compressedTextV2.length < stringifiedObjectV2.length).toBe(true);
		console.log('v2 - compressed text', compressedTextV2);
		console.log('v2 - original size', stringifiedObjectV2.length, 'compressed size', compressedTextV2.length);
		console.log('v2 - compressed size', (100 * compressedTextV2.length / stringifiedObjectV2.length), 'of original');
	});

	it('v2 - should not contain property names', () => {
		expect(compressedTextV2.indexOf('firstName')).toBe(-1);
		expect(compressedTextV2.indexOf('kilometers')).toBe(-1);
	});

	it('v2 - should not contain common texts', () => {
		expect(compressedTextV2.indexOf('Australian')).toBe(-1);
		expect(compressedTextV2.indexOf('Audi')).toBe(-1);
	});

	it('v2 - should decompress', () => {
		const decompressResult: IDecompressObjectResult = myCompressor.decompress(compressedTextV2);
		expect(decompressResult.errors.length).toBe(0);
		expect(decompressResult.obj.firstName).toBe("Lola");
		expect(decompressResult.obj.cars[0].kilometers).toBe(2000);
	});

});


describe('Compress Lorem ipsum text', () => {
	const rawData: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nulla turpis, egestas et ex vitae, tincidunt molestie sem. In vehicula metus eu diam euismod facilisis. Nunc convallis blandit neque ornare euismod. Nulla vel ante sed nisl posuere ornare eget eget sapien. Quisque dapibus aliquet facilisis. Pellentesque volutpat finibus venenatis. Proin mollis pretium felis fringilla faucibus. Suspendisse rutrum posuere convallis. Vestibulum fringilla massa ac efficitur molestie. Nunc nec iaculis magna, ac ornare orci. Suspendisse vel odio sed arcu accumsan faucibus. Phasellus vulputate dui ac nibh mattis, vitae volutpat nibh mattis. ";
	const commonTexts: string[] = rawData.replace(/\./g, " ").replace(/\,/g, " ").replace(/  /g, " ").split(" ");
	const compressor = new DynaTextCompress(commonTexts);
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

