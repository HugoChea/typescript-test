export interface Article {

    id: number;
    
    name: string;

    /**
     * Price in cents (1e => 100c)
     */
    price: number;
}