import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { promises as fs } from 'fs';

/**
 * Read json file as input containing :
 * - articles
 * - carts of customer with article id and quantity
 * 
 * Generate file with each carts and their total
 */
export async function main() {
  try {
    const inputData: JSON = await loadInput("input.json");
    console.log(inputData);

    // loop through articles
    // loop through carts
    // calculate total by article
    // calculate total by cart
    // generate output and write file
  }
  catch (error) {
    console.log(error);
  }
}

/**
 * Take filename string as parameter and read it as utf8 string
 * Return content as JSON
 * @param filename 
 * @returns 
 */
export async function loadInput(filename: string) {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  }
  catch (error) {
    throw error;
  }
}

if (import.meta.url != null && process.argv[1] === fileURLToPath(import.meta.url)) {
  // The script was run directly.
  main();
}