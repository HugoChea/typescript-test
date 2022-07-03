import { promises as fs } from 'fs';
import { Article } from "../model/Article.js";
import { CustomerCart } from "../model/CustomerCart.js";
import { Output } from "../model/Output.js";
import { CartService } from "./CartService.js";

const cartService: CartService = new CartService();

describe("load input", () => {

  const readFileSpy = jest.spyOn(fs, 'readFile');

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("it should return input file content as JSON", async () => {

    const validJSON = {
      property: "value"
    }
    const validFileText = JSON.stringify(validJSON);
    readFileSpy.mockResolvedValue(validFileText);
    try {
      let data: JSON = await cartService.loadInput('input.json');
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(data).toStrictEqual(validJSON);
    } catch (error) {
      fail('it should not reach here');
    }

  });

  test("it should return an error because of invalid input format", async () => {

    const jsonParseSpy = jest.spyOn(JSON, 'parse');

    const invalidFileText = "";
    readFileSpy.mockResolvedValue(invalidFileText);
    jsonParseSpy.mockRejectedValue("SyntaxError: Unexpected end of JSON input")

    try {
      let data: JSON = await cartService.loadInput('input.json');
      fail('it should not reach here');
    }
    catch (error) {
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(jsonParseSpy).toHaveBeenCalledWith(invalidFileText);
      expect(error).toBe("SyntaxError: Unexpected end of JSON input")
    }

  });

  test("it should return an error because file not found", async () => {
    readFileSpy.mockRejectedValue("Error: ENOENT: no such file or directory")
    try {
      let data: JSON = await cartService.loadInput('not-found-input.json');
      fail('it should not reach here');
    }
    catch (error) {
      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(error).toBe("Error: ENOENT: no such file or directory")
    }
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

  test("it should calculate 0 if no article in customer cart", () => {
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