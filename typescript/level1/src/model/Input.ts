import { Article } from "./Article.js";
import { CustomerCart } from "./CustomerCart.js";

export interface Input {
    
    articles: Article[];

    carts: CustomerCart[];
}