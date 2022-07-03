export interface CheckoutCart {

    id: number;

    /**
     * total cost of cart
     * in cents (1e => 1c)
     */
    total: number;
}