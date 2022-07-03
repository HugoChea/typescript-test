import { promises as fs } from 'fs';
import { Output } from '../model/Output.js';

export class FileHelperService {

	/**
   * Take filename string as parameter and read it as utf8 string
   * Return content as JSON
   * @param filename 
   * @returns 
   */
	async loadInput(fileName: string) {
		try {
			const data = await fs.readFile(fileName, "utf8");
			return JSON.parse(data);
		}
		catch (error) {
			throw error;
		}
	}

	/**
	 * Convert output object into json prettyfied
	 * And add non printable character
	 * @param output 
	 * @returns 
	 */
	convertOutputToText(output: Output): string {
		let text = JSON.stringify(output, null, 2);
		return this.addNonPrintablecharacter(text);
	}

	/**
	 * Add non printable character so output file content equal expected output file content
	 * @param jsonText 
	 * @returns 
	 */
	addNonPrintablecharacter(jsonText: string) {
		let stringSplited = jsonText.split(/\n/);
		let newStringArray: string[] = [];

		for (const [index, value] of stringSplited.entries()) {
			//Handled last iteration
			if (index !== stringSplited.length - 1) {
				newStringArray.push(value + "\r\n");
			}
			else {
				newStringArray.push(value)
			}
		}

		return newStringArray.join('');
	}
}