import { CartItem } from "./CartItem.js";

export interface CustomerCart {

    id: number;
    
    items: CartItem[];
}