import { Article } from "../model/Article.js";
import { CustomerCart } from "../model/CustomerCart.js";
import { DeliveryFee } from '../model/DeliveryFee.js';
import { Discount } from "../model/Discount.js";
import { Output } from "../model/Output.js";
import { CartService } from "./CartService.js";

const cartService: CartService = new CartService();

describe("convertArticleArrayToMap", () => {
  test("it should generate Map from array of Article", () => {
    const articleA: Article = {
      "id": 1,
      "name": "water",
      "price": 100
    };

    const articleB: Article = {
      "id": 2,
      "name": "honey",
      "price": 200
    }

    const articlesArray: Article[] = [articleA, articleB];
    const expectedMap = new Map();
    expectedMap.set(articleA.id, articleA);
    expectedMap.set(articleB.id, articleB);

    const catalogMap = cartService.convertArticleArrayToMap(articlesArray);
    expect(expectedMap).toStrictEqual(catalogMap);
  });

  test("it should generate Map from empty array", () => {

    const articlesArray: Article[] = [];
    const expectedMap = new Map();

    const catalogMap = cartService.convertArticleArrayToMap(articlesArray);
    expect(expectedMap).toStrictEqual(catalogMap);
  });
});

describe("convertDiscountArrayToMap", () => {
  test("it should generate Map from array of Article", () => {
    const discountA: Discount = {
      "article_id": 2,
      "type": "amount",
      "value": 25
    };

    const discountB: Discount = {
      "article_id": 5,
      "type": "percentage",
      "value": 30
    };

    const discountArray: Discount[] = [discountA, discountB];
    const expectedMap = new Map();
    expectedMap.set(discountA.article_id, discountA);
    expectedMap.set(discountA.article_id, discountA);

    const discountMap = cartService.convertDiscountArrayToMap(discountArray);
    expect(expectedMap).toStrictEqual(discountMap);
  });

  test("it should generate Map from empty array", () => {

    const discountArray: Discount[] = [];
    const expectedMap = new Map();

    const discountMap = cartService.convertDiscountArrayToMap(discountArray);
    expect(expectedMap).toStrictEqual(discountMap);
  });
});

describe("calculateTotalArticlePrice", () => {
  test("it should calculate total price", () => {
    const price = 100;
    const quantity = 2;
    const expectedTotal = price * quantity;
    const result = cartService.calculateTotalArticlePrice(price, quantity);
    expect(expectedTotal).toStrictEqual(result);
  });

});

describe('calculateTotalPriceCart', () => {

  const articleCatalogMap: Map<number, Article> = new Map();
  const articleA: Article = {
    "id": 1,
    "name": "water",
    "price": 100
  }
  const articleB: Article = {
    "id": 2,
    "name": "honey",
    "price": 200
  }
  articleCatalogMap.set(articleA.id, articleA);
  articleCatalogMap.set(articleB.id, articleB);

  test("it should calculate correctly with customer cart containing articles", () => {
    const cart: CustomerCart = {
      "id": 1,
      "items": [
        {
          "article_id": 1,
          "quantity": 6
        },
        {
          "article_id": 2,
          "quantity": 2
        }
      ]
    }

    const result = cartService.calculateTotalPriceCart(articleCatalogMap, cart);
    expect(result).toStrictEqual(1000);
  });

  test("it should calculate 0 + 800 if no article in customer cart", () => {
    const cart: CustomerCart = {
      "id": 1,
      "items": []
    }

    const result = cartService.calculateTotalPriceCart(articleCatalogMap, cart);
    expect(result).toStrictEqual(0);
  });

  test("it should throw error if article found in customer cart does not exist", () => {

    const emptyCatalogMap: Map<number, Article> = new Map();

    const cart: CustomerCart = {
      "id": 1,
      "items": [{
        "article_id": 1,
        "quantity": 6
      },]
    }

    expect(() => {
      const result = cartService.calculateTotalPriceCart(emptyCatalogMap, cart);
    }).toThrow('Article in cart not found');
  });
});

describe('generateOutput', () => {
  const input = {
    "articles": [
      {
        "id": 1,
        "name": "water",
        "price": 100
      },
      {
        "id": 2,
        "name": "honey",
        "price": 200
      },
      {
        "id": 3,
        "name": "mango",
        "price": 400
      },
      {
        "id": 4,
        "name": "tea",
        "price": 1000
      }
    ],
    "carts": [
      {
        "id": 1,
        "items": [
          {
            "article_id": 1,
            "quantity": 6
          },
          {
            "article_id": 2,
            "quantity": 2
          },
          {
            "article_id": 4,
            "quantity": 1
          }
        ]
      },
      {
        "id": 2,
        "items": [
          {
            "article_id": 2,
            "quantity": 1
          },
          {
            "article_id": 3,
            "quantity": 3
          }
        ]
      },
      {
        "id": 3,
        "items": []
      }
    ],
    "delivery_fees": [
      {
        "eligible_transaction_volume": {
          "min_price": 0,
          "max_price": 1000
        },
        "price": 800
      },
      {
        "eligible_transaction_volume": {
          "min_price": 1000,
          "max_price": 2000
        },
        "price": 400
      },
      {
        "eligible_transaction_volume": {
          "min_price": 2000,
          "max_price": null
        },
        "price": 0
      }
    ],
    "discounts": [
      {
        "article_id": 2,
        "type": "amount",
        "value": 25
      },
      {
        "article_id": 5,
        "type": "percentage",
        "value": 30
      },
      {
        "article_id": 6,
        "type": "percentage",
        "value": 30
      },
      {
        "article_id": 7,
        "type": "percentage",
        "value": 25
      },
      {
        "article_id": 8,
        "type": "percentage",
        "value": 10
      }
    ]
  };

  const expectedOutput = {
    "carts": [
      {
        "id": 1,
        "total": 2000
      },
      {
        "id": 2,
        "total": 1400
      },
      {
        "id": 3,
        "total": 0
      }
    ]
  }

  test("it should return expected output", () => {
    try {
      let output: Output = cartService.generateOutput(input);
      expect(output).toEqual(expectedOutput);
    }
    catch (error) {
    }
  });

});


describe('calculateDeliveryFees', () => {

  const deliveryFeeRate: DeliveryFee[] = [
    {
      "eligible_transaction_volume": {
        "min_price": 0,
        "max_price": 1000
      },
      "price": 800
    },
    {
      "eligible_transaction_volume": {
        "min_price": 1000,
        "max_price": 2000
      },
      "price": 400
    },
    {
      "eligible_transaction_volume": {
        "min_price": 2000,
        "max_price": null
      },
      "price": 0
    }
  ]
  
  test("it should return expected output", () => {
    const fee = cartService.calculateDeliveryFees(0, deliveryFeeRate);
    expect(fee).toStrictEqual(800);
  });

  test("it should return expected output", () => {
    const fee = cartService.calculateDeliveryFees(1000, deliveryFeeRate);
    expect(fee).toStrictEqual(400);
  });

  test("it should return expected output", () => {
    const fee = cartService.calculateDeliveryFees(2000, deliveryFeeRate);
    expect(fee).toStrictEqual(0);
  });

});