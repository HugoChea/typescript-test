import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { promises as fs } from 'fs';
import { Input } from './model/Input';
import { Article } from './model/Article';
import { CustomerCart } from './model/CustomerCart';
import { Output } from './model/Output';
import { CheckoutCart } from './model/CheckoutCart';

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

    const output: Output = generateOutput(inputData);
    console.log(output);
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

/**
 * Given price and quantity
 * Return total price
 * @param price 
 * @param quantity 
 * @returns 
 */
export function calculateTotalArticlePrice(price: number, quantity: number): number {
  return price*quantity;
}

/**
 * Given a customer cart
 * Calculate total price of the cart based on catalog of articles
 * @param articleCatalogMap 
 * @param cart 
 * @returns 
 */
export function calculateTotalPriceCart(articleCatalogMap: Map<number, Article>, cart: CustomerCart): number {
  let total = 0;
  for (const item of cart.items) {
    let article = articleCatalogMap.get(item.article_id)
    if (article) {
      total += calculateTotalArticlePrice(article.price, item.quantity)
    }
    else{
      throw 'Article in cart not found';
    }
  }

  return total;
}

/**
 * Given input with article list and customers carts
 * Generate output data with each carts and their total
 * @param input 
 * @returns 
 */
export function generateOutput(input: Input): Output {

  const articleCatalogMap: Map<number, Article> = convertArticleArrayToMap(input.articles);

  let allCheckoutCart: CheckoutCart[] = [];

  try{
    for (const cart of input.carts) {
      let totalPriceCart = calculateTotalPriceCart(articleCatalogMap, cart);

      let checkoutCart: CheckoutCart = {
        id: cart.id,
        total: totalPriceCart
      };
      allCheckoutCart.push(checkoutCart);
    }
  } catch(error){
    throw error
  }

  return {
    carts: allCheckoutCart
  }
}

if (import.meta.url != null && process.argv[1] === fileURLToPath(import.meta.url)) {
  // The script was run directly.
  main();
}