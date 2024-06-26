import httpMocks from "node-mocks-http";
import { productValidate } from "../product";
import { getFakeProductTObject, getFakeCreateProductTObject } from "../../../utils/fake";

describe("Product validate", () => {
  describe("Validate Product", () => {
    it("returns 200 with valid product type", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: getFakeProductTObject(),
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateProduct(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("returns 400 with invalid value type - expected string", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { ...getFakeProductTObject(), name: 10 },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Expected string, received number");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 400 with invalid option type", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { ...getFakeProductTObject(), option: { size: "big" } },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Expected array, received string");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 200 with invalid value type, expected number", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { ...getFakeProductTObject(), price: "10" },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Expected number, received string");
      expect(next).toHaveBeenCalledTimes(0);
    });
  });
  describe("Validate Create Product", () => {
    it("returns 400 with unrecognized product key", () => {
      const key = "invalid";

      const req = httpMocks.createRequest({
        method: "POST",
        body: { ...getFakeCreateProductTObject(), [key]: key },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCreateProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe(`Unrecognized key(s) in object: '${key}'`);
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("return 400 with missing key", () => {
      const product = { ...getFakeCreateProductTObject(), name: null };
      const { name, ...missing } = product;

      const req = httpMocks.createRequest({
        method: "POST",
        body: missing,
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCreateProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Required");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 200 wtih create type of product", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: getFakeCreateProductTObject(),
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCreateProduct(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validate Partial Product", () => {
    it("returns 400 with unrecognized product key", () => {
      const key = "unrecognized";

      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          [key]: key,
          name: "name",
          price: 1500,
          category: "category",
          url: "url",
          option: {},
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePartialProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe(`Unrecognized key(s) in object: '${key}'`);
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 200 with any permitted partial product key", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          url: "url",
          name: "name",
          price: 1500,
          option: {},
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePartialProduct(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("returns 400 with not permitted partial product key", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          id: "id not permitted",
          name: "name",
          price: 1500,
          category: "category",
          url: "url",
          option: {},
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePartialProduct(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Unrecognized key(s) in object: 'id'");
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe("Validate Id", () => {
    it("returns 400 without id on request", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        params: {
          // id: "22",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateIdParams(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Required");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 200 with id on request", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        params: {
          id: "22",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateIdParams(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validate Popular Query", () => {
    it("it returns 400 with query that cannot be parsed to int", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          amount: "string-10",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePopularQuery(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Faild to parse to int.");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("it returns 200 with query that can be parsed to int", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          amount: "10",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePopularQuery(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("it returns 400 without amount key in query", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          // amount: "10",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePopularQuery(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Required");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("it returns 400 with unrecognized key(s) in query", () => {
      const key = "unrecognizedKey";
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          [key]: key,
          amount: "10",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validatePopularQuery(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe(`Unrecognized key(s) in object: '${key}'`);
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe("Validate Category Query", () => {
    it("it returns 400 without category key in query", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          // category: "category",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCategoryQuery(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe("Required");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("it returns 400 with unrecognized key(s) in query", () => {
      const key = "unrecognizedKey";
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          [key]: key,
          category: "category",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCategoryQuery(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe(`Unrecognized key(s) in object: '${key}'`);
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("it returns 200 with category query", () => {
      const req = httpMocks.createRequest({
        method: "POST",
        query: {
          category: "category",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      productValidate.validateCategoryQuery(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
