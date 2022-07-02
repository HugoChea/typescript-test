import { Article } from "./Article";
import { CustomerCart } from "./CustomerCart";

export interface Input {
    
    articles: Article;
    
    carts: CustomerCart[];
}