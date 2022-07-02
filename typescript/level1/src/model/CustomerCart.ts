import { CartItem } from "./CartItem";

export interface CustomerCart {

    id: number;
    
    items: CartItem[];
}