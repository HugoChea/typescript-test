import { Article } from "../model/Article.js";
import { CheckoutCart } from "../model/CheckoutCart.js";
import { Input } from "../model/Input.js";
import { Output } from "../model/Output.js";
import { promises as fs } from 'fs';
import { CustomerCart } from "../model/CustomerCart.js";

export class CartService {

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
   * Convert Array of Article into Map
   * Ease finding article when going through list of CartItem
   * @param catalog 
   * @returns 
   */
  convertArticleArrayToMap(catalog: Article[]) {
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
  calculateTotalArticlePrice(price: number, quantity: number): number {
    return price * quantity;
  }

  /**
   * Given a customer cart
   * Calculate total price of the cart based on catalog of articles
   * @param articleCatalogMap 
   * @param cart 
   * @returns 
   */
  calculateTotalPriceCart(articleCatalogMap: Map<number, Article>, cart: CustomerCart): number {
    let total = 0;
    for (const item of cart.items) {
      let article = articleCatalogMap.get(item.article_id)
      if (article) {
        total += this.calculateTotalArticlePrice(article.price, item.quantity)
      }
      else {
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
  generateOutput(input: Input): Output {

    const articleCatalogMap: Map<number, Article> = this.convertArticleArrayToMap(input.articles);

    let allCheckoutCart: CheckoutCart[] = [];

    try {
      for (const cart of input.carts) {
        let totalPriceCart = this.calculateTotalPriceCart(articleCatalogMap, cart);

        let checkoutCart: CheckoutCart = {
          id: cart.id,
          total: totalPriceCart
        };
        allCheckoutCart.push(checkoutCart);
      }
    } catch (error) {
      throw error
    }


    return {
      carts: allCheckoutCart
    }
  }
}