import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { promises as fs } from 'fs';
import { Input } from './model/Input';
import { Article } from './model/Article';

/**
 * Read json file as input containing :
 * - articles
 * - carts of customer with article id and quantity
 * 
 * Generate file with each carts and their total
 */
export async function main() {
  try {
    const inputData: Input = await loadInput("input.json");

    // convert list of article as map to ease manipulations
    const articleCatalogMap: Map<number, Article> = convertArticleArrayToMap(inputData.articles);

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
export async function loadInput(filename: string): Promise<Input> {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  }
  catch (error) {
    throw error;
  }
}

/**
 * Convert Array of Article into Map
 * Ease finding article when going through list of CartItem
 * @param catalog 
 * @returns 
 */
export function convertArticleArrayToMap(catalog: Article[]): Map<number, Article> {
  return new Map(
    catalog.map(article => {
      return [article.id, article];
    }),
  );
}

if (import.meta.url != null && process.argv[1] === fileURLToPath(import.meta.url)) {
  // The script was run directly.
  main();
}