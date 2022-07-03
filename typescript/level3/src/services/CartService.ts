import { Article } from "../model/Article.js";
import { CheckoutCart } from "../model/CheckoutCart.js";
import { Input } from "../model/Input.js";
import { Output } from "../model/Output.js";
import { CustomerCart } from "../model/CustomerCart.js";
import { DeliveryFee } from "../model/DeliveryFee.js";
import { Discount } from "../model/Discount.js";

export class CartService {

  /**
   * Convert Array of Article into Map
   * Ease finding article when going through list of CartItem
   * @param catalog 
   * @returns 
   */
  convertArticleArrayToMap(catalog: Article[]): Map<number, Article> {
    return new Map(
      catalog.map(article => {
        return [article.id, article];
      }),
    );
  }

  /**
   * Convert Array of Discount into Map
   * Ease finding article discount when calculating cart total
   * @param discount 
   * @returns 
   */
   convertDiscountArrayToMap(discount: Discount[]): Map<number, Discount> {
    return new Map(
      discount.map(discount => {
        return [discount.article_id, discount];
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
   * Given cart price, return delivery fee based on rate
   * @param cartPrice 
   * @param deliveryFeeRate 
   * @returns 
   */
  calculateDeliveryFees(cartPrice: number, deliveryFeeRate: DeliveryFee[]): number {
    let fees: number = 0;
    
    for (const fee of deliveryFeeRate) {
      if (fee.eligible_transaction_volume.max_price) {
        if (cartPrice >= fee.eligible_transaction_volume.min_price && cartPrice < fee.eligible_transaction_volume.max_price){
          return fee.price;
        }
      }
      if (!fee.eligible_transaction_volume.max_price){
        if (cartPrice >= fee.eligible_transaction_volume.min_price){
          return fee.price;
        }
      }
    }

    return fees;
  }

  /**
   * Given input with article list and customers carts
   * Generate output data with each carts and their total
   * @param input 
   * @returns 
   */
  generateOutput(input: Input): Output {

    const articleCatalogMap: Map<number, Article> = this.convertArticleArrayToMap(input.articles);
    const deliveryFeeRate: DeliveryFee[] = input.delivery_fees;

    let allCheckoutCart: CheckoutCart[] = [];

    try {
      for (const cart of input.carts) {
        let totalPriceCart = this.calculateTotalPriceCart(articleCatalogMap, cart);
        totalPriceCart += this.calculateDeliveryFees(totalPriceCart, deliveryFeeRate);

        let checkoutCart: CheckoutCart = {
          id: cart.id,
          total: totalPriceCart
        };
        allCheckoutCart.push(checkoutCart);
      }
    } catch (error) {
      throw error;
    }


    return {
      carts: allCheckoutCart
    };
  }
}