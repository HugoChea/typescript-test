import { FeeRange } from "./FeeRange.js";

export interface DeliveryFee {
    
    eligible_transaction_volume: FeeRange;

    price: number;
}