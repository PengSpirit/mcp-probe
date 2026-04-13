import { describe, it, expect } from "vitest";
import { generateSampleArgs } from "./sample-args.js";

describe("generateSampleArgs", () => {
  it("generates string for required string field", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    });
    expect(args).toEqual({ name: "test" });
  });

  it("generates number for required number field", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        count: { type: "number" },
      },
      required: ["count"],
    });
    expect(args).toEqual({ count: 1 });
  });

  it("skips optional fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        required_field: { type: "string" },
        optional_field: { type: "string" },
      },
      required: ["required_field"],
    });
    expect(args).toEqual({ required_field: "test" });
    expect(args).not.toHaveProperty("optional_field");
  });

  it("uses default value when available", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        mode: { type: "string", default: "fast" },
      },
      required: ["mode"],
    });
    expect(args).toEqual({ mode: "fast" });
  });

  it("uses first enum value", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        color: { type: "string", enum: ["red", "blue", "green"] },
      },
      required: ["color"],
    });
    expect(args).toEqual({ color: "red" });
  });

  it("generates URL for url-named fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        callback_url: { type: "string" },
      },
      required: ["callback_url"],
    });
    expect(args.callback_url).toBe("https://example.com");
  });

  it("returns empty object for no required fields", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        optional: { type: "string" },
      },
    });
    expect(args).toEqual({});
  });

  it("generates value matching UUID pattern", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$" },
      },
      required: ["id"],
    });
    expect(args.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("picks first option from oneOf", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        value: { oneOf: [{ type: "string" }, { type: "number" }] },
      },
      required: ["value"],
    });
    expect(typeof args.value).toBe("string");
  });

  it("picks first option from anyOf", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        value: { anyOf: [{ type: "number" }, { type: "string" }] },
      },
      required: ["value"],
    });
    expect(typeof args.value).toBe("number");
  });

  it("generates nested object args", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        config: {
          type: "object",
          properties: {
            name: { type: "string" },
            count: { type: "number" },
          },
          required: ["name"],
        },
      },
      required: ["config"],
    });
    expect(args.config).toEqual({ name: "test" });
  });

  it("generates array with minItems", () => {
    const args = generateSampleArgs({
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
        },
      },
      required: ["tags"],
    });
    expect(args.tags).toHaveLength(2);
    expect((args.tags as string[])[0]).toBe("test");
  });
});
