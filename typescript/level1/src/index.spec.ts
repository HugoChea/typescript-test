import { main } from './index.js';
import { promises as fs } from 'fs';
import { CartService } from './services/CartService.js';
import { FileHelperService } from './services/FileHelperService.js';

describe("main", () => {
  test("it should call all functions", async () => {

    let cartService: CartService = new CartService();
    let fileHelperService: FileHelperService = new FileHelperService();
    const loadInputSpy = jest.spyOn(fileHelperService, 'loadInput').mockResolvedValue({
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
    });

    const generateOutputSpy = jest.spyOn(cartService, 'generateOutput');

    // to not write it really
    const writeFileServiceSpy = jest.spyOn(fs, 'writeFile').mockResolvedValue();

    await main(cartService, fileHelperService);
    expect(loadInputSpy).toHaveBeenCalledTimes(1);
    expect(generateOutputSpy).toHaveBeenCalledTimes(1);
    expect(writeFileServiceSpy).toHaveBeenCalledTimes(1);
  });
});