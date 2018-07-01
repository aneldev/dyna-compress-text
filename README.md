
# Use cases

- JWT tokens / general tokens
- Compress an object to pass it to url
- Compress objects to store them in cookies or to localStorage

Compress ratio 65% - 45%

**Note:** is not intended for full text compression. It is optimized for small amount of repeated unique parts, approx 50. It can work for more unique parts but the compression ratio will be lower.

# Compress text with `DynaTextCompress`

## Example
_The example is in TypeScript._
```
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

    let compressedText: string = myCompressor.compress(stringifiedObject);
    console.log('compressed text', compressedText);
    console.log('original size', stringifiedObject.length, 'compressed size', compressedText.length);
    console.log('compressed size', (100 * compressedText.length / stringifiedObject.length), 'of original');

```
This consoles:
```
compressed text !I!BJohn!G!CSmith!G!D32,!EAustralian!G!FVW!A!H
original size 87 compressed size 46
compressed size 52.87356321839081 of original
```

## The story

It is very difficult to compress a string because in most of the cases the length is already small and there is not enough space for the algorithm to develop dynamic variables.

But if you know the content of the string then you can learn the compressor how to compress.
This is how this compressor works. You give it the common repeated texts and it replaces them by short variables.

No magic, no strange algorithms and very high compression ratio!

## API

### constructor(private  commonTexts: string[], forEncode: boolean = true, private compressSymbol: string = "!")

`forEncode`, set this to true if you are going to use the compressed output to url. Setting this to true it also compresses some chars that are longer in encoded version. 

`compressSymbol` by default is the "!" but you can use whatever you want.

### compress(text: string): string

### decompress(compressed: string): IDecompressTextResult

The decompress returns this interface:
```
interface IDecompressTextResult {
    text: string,
    errors: string[]
}
```

# Compress objects with `DynaObjectCompress`

## Example
_The example is in TypeScript._
```
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
    
    let compressedText: string  = myCompressor.compress(stringifiedObject);

    console.log('compressed text', compressedText);
    console.log('original size', stringifiedObject.length, 'compressed size', compressedText.length);
    console.log('compressed size', (100 * compressedText.length / stringifiedObject.length), 'of original');
```
This consoles:
```
compressed text !I!BJohn!G!CSmith!G!D32,!EAustralian!G!FVW!A!H
original size 87 compressed size 46
compressed size 52.87356321839081 of original
```

## The story

In the same way you can compress objects. Instead of giving `commonTexts` you can give a `objectPattern` with any structure. The compressor will detect all the properties and will build the `commonTexts` for you. You can additionally supply your `commonTexts` for repeated texts in the data.

In `objectPattern` apply some values because the compressor needs to know the type of every property.

## API

### constructor(objectPattern: any, commonTexts: string[] = [], forEncode: boolean = true)

`objectPattern` is an object that has any structure based on the property names we want to compress. Define the values there to get the type of each property. Nested objects and arrays are supported.

### compress(obj: any): string

### decompress(compressed: string): IDecompressObjectResult

The decompress returns this interface:
```
interface IDecompressTextResult {
    obj: any,
    errors: string[]
}
```

# Compress objects with versions with `DynaObjectCompressVersion`

## The story

**Changing the common texts or the object pattern you will make the compressor not to be able to decompress the old compressed data with the previous ones.**

You can avoid it by versioning the common texts and the object patterns with the use of `DynaObjectCompressVersion`.

The API is the same with the `DynaObjectCompress` with only difference the constructor.

## Example
_The example is in TypeScript._
```
    const dataPatternV1: any = {
        firstName: "s",
        lastName: "s",
        age: 0,
        nationality: "s",
    };

    //After a while we need a new prop, the cars!
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

    const compressedTextV1 = myCompressor.compress("v1", dataV1);
    const compressedTextV2 = myCompressor.compress("v2", dataV2);

    // and now we decompress with the same method any compressed string
    const decompressResultA = myCompressor.decompress(compressedTextV1);  // returns the dataV1
    const decompressResultB = myCompressor.decompress(compressedTextV2);  // returns the dataV2

```
## API

_Only the constructor is different._

```
    constructor(versionCompressConfig: IVersionCompressConfig,
                forEncode: boolean = true,
                private compressSymbol: string = "!") {
```
where `IVersionCompressConfig` is
```
interface IVersionCompressConfig {
    [version: string]: {
        objectPattern: any,
        commonTexts?: string[]
    }
}
```

