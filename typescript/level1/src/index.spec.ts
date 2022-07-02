import { main } from './index.js';
import { loadInput } from './index.js';
import { promises as fs } from 'fs';

describe(main, () => {
  test("dummy", () => {
    expect(typeof main).toBe('function');
  });
});

describe(loadInput, () => {

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
      let inputData: JSON = await loadInput('input.json');
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(inputData).toStrictEqual(validJSON);
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
      let inputData: JSON = await loadInput('input.json');
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
      let inputData: JSON = await loadInput('not-found-input.json');
      fail('it should not reach here');
    }
    catch (error) {
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(error).toBe("Error: ENOENT: no such file or directory")
    }
  });

});