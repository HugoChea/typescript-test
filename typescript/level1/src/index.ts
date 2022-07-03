import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { promises as fs } from 'fs';
import { Input } from './model/Input.js';
import { Output } from './model/Output.js';
import { CartService } from './services/CartService.js';

/**
 * Read json file as input containing :
 * - articles
 * - carts of customer with article id and quantity
 * 
 * Generate file with each carts and their total
 */
export async function main(cartService: CartService) {
  try {
    const inputData: Input = await cartService.loadInput("input.json");

    const output: Output = cartService.generateOutput(inputData);

    fs.writeFile('output.json', JSON.stringify(output, null, 2));
  }
  catch (error) {
    console.log(error);
  }
}

if (import.meta.url != null && process.argv[1] === fileURLToPath(import.meta.url)) {
  // The script was run directly.
  main(new CartService());
}