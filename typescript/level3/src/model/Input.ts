import { Article } from "./Article.js";
import { CustomerCart } from "./CustomerCart.js";
import { DeliveryFee } from "./DeliveryFee.js";
import { Discount } from "./Discount.js";

export interface Input {
    
    articles: Article[];

    carts: CustomerCart[];

    delivery_fees: DeliveryFee[];

    discounts: Discount[];
}