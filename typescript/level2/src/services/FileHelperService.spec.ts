import { promises as fs } from 'fs';
import { Output } from '../model/Output.js';
import { FileHelperService } from './FileHelperService.js';

let fileHelperService: FileHelperService = new FileHelperService();

describe("load input", () => {

	const readFileSpy = jest.spyOn(fs, 'readFile');

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("it should return input file content as JSON", async () => {

		const validJSON = {
			property: "value"
		}
		const validFileText = JSON.stringify(validJSON);
		readFileSpy.mockResolvedValue(validFileText);
		try {
			let data: JSON = await fileHelperService.loadInput('input.json');
			expect(readFileSpy).toHaveBeenCalledTimes(1);
			expect(data).toStrictEqual(validJSON);
		} catch (error) {
			fail('it should not reach here');
		}

	});

	test("it should return an error because of invalid input format", async () => {

		const jsonParseSpy = jest.spyOn(JSON, 'parse');

		const invalidFileText = "";
		readFileSpy.mockResolvedValue(invalidFileText);
		jsonParseSpy.mockRejectedValue("SyntaxError: Unexpected end of JSON input")

		try {
			let data: JSON = await fileHelperService.loadInput('input.json');
			fail('it should not reach here');
		}
		catch (error) {
			expect(readFileSpy).toHaveBeenCalledTimes(1);
			expect(jsonParseSpy).toHaveBeenCalledWith(invalidFileText);
			expect(error).toBe("SyntaxError: Unexpected end of JSON input")
		}

	});

	test("it should return an error because file not found", async () => {
		readFileSpy.mockRejectedValue("Error: ENOENT: no such file or directory")
		try {
			let data: JSON = await fileHelperService.loadInput('not-found-input.json');
			fail('it should not reach here');
		}
		catch (error) {
			expect(readFileSpy).toHaveBeenCalledTimes(1);
			expect(error).toBe("Error: ENOENT: no such file or directory")
		}
	});

});

describe("convertOutputToText", () => {
	test("it should return input file content as JSON", async () => {
		let output: Output = {
			"carts": [
				{
					"id": 1,
					"total": 2000
				},
				{
					"id": 2,
					"total": 1400
				},
				{
					"id": 3,
					"total": 0
				}
			]
		};

		let jsonString = JSON.stringify(output, null, 2);
		let jsonStringWithNonPrintableChar = fileHelperService.convertOutputToText(output);
		expect(jsonStringWithNonPrintableChar).not.toBe(jsonString);
	});

});

describe("addNonPrintablecharacter", () => {
	test("it should not be equal before and after adding non printable character", async () => {
		let json = {
			"carts": [
				{
					"id": 1,
					"total": 2000
				},
				{
					"id": 2,
					"total": 1400
				},
				{
					"id": 3,
					"total": 0
				}
			]
		};

		let jsonString = JSON.stringify(json, null, 2);
		let jsonStringWithNonPrintableChar = fileHelperService.addNonPrintablecharacter(jsonString);
		expect(jsonStringWithNonPrintableChar).not.toBe(jsonString);
	});

});