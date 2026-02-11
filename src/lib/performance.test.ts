/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  measurePerformance,
  debounce,
  throttle,
  createChunkedProcessor,
  estimateReadingTime,
  generateCacheKey,
  batchOperations,
} from "./performance";

describe("Performance Utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("measurePerformance", () => {
    it("should measure execution time of a synchronous function", () => {
      const start = performance.now();
      const result = measurePerformance("test-sync", () => {
        const sum = 0;
        for (let i = 0; i < 1000; i++) {
          // Simple synchronous operation
        }
        return sum;
      });
      const end = performance.now();

      Promise.resolve(result).then((r) => {
        expect(r.result).toBe(0);
        expect(r.duration).toBeGreaterThanOrEqual(0);
        expect(r.operation).toBe("test-sync");
      });
    });

    it("should measure execution time of an asynchronous function", async () => {
      const result = await measurePerformance("test-async", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "completed";
      });

      expect(result.result).toBe("completed");
      expect(result.duration).toBeGreaterThanOrEqual(10);
      expect(result.operation).toBe("test-async");
    });

    it("should handle errors and still return duration", async () => {
      const result = await measurePerformance("test-error", () => {
        throw new Error("Test error");
      });

      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Test error");
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("debounce", () => {
    it("should delay function execution", () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(fn).not.toHaveBeenCalled();
    });

    it("should call function after delay", () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 50);

      debouncedFn("first");
      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("throttle", () => {
    it("should limit function calls", () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("createChunkedProcessor", () => {
    it("should process items in chunks", async () => {
      const items = [1, 2, 3, 4, 5];
      const processed: number[] = [];

      const processItem = createChunkedProcessor<number>(
        (item) => {
          processed.push(item);
          return Promise.resolve();
        },
        { chunkSize: 2, delayMs: 0 }
      );

      await processItem(items);

      expect(processed).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty arrays", async () => {
      const fn = vi.fn();
      const processItem = createChunkedProcessor(fn, { chunkSize: 2, delayMs: 0 });

      await processItem([]);

      expect(fn).not.toHaveBeenCalled();
    });

    it("should handle batch size larger than operations", async () => {
      const operations = [vi.fn().mockResolvedValue("a")];

      const results = await batchOperations(operations, { chunkSize: 10 });

      expect(results).toEqual(["a"]);
    });
  });

  describe("estimateReadingTime", () => {
    it("should return 1 minute for short text", () => {
      const text = "This is a short text.";
      const result = estimateReadingTime(text);
      expect(result).toBe(1);
    });

    it("should return 1 minute for empty text", () => {
      const result = estimateReadingTime("");
      expect(result).toBe(1);
    });

    it("should calculate based on word count", () => {
      const words = Array(200).fill("word").join(" ");
      const result = estimateReadingTime(words);
      expect(result).toBe(1);
    });

    it("should round up to nearest minute", () => {
      const words = Array(150).fill("word").join(" ");
      const result = estimateReadingTime(words);
      expect(result).toBe(1);
    });
  });

  describe("generateCacheKey", () => {
    it("should generate a key with prefix", () => {
      const key = generateCacheKey("user", { id: 123, name: "John" });
      expect(key).toContain("user:");
    });

    it("should include object properties in key", () => {
      const key = generateCacheKey("data", { page: 1, limit: 10 });
      expect(key).toContain("page_1");
      expect(key).toContain("limit_10");
    });

    it("should handle empty options", () => {
      const key = generateCacheKey("test", {});
      expect(key).toBe("test:");
    });
  });

  describe("batchOperations", () => {
    it("should execute operations in batches", async () => {
      const operations = [
        vi.fn().mockResolvedValue(1),
        vi.fn().mockResolvedValue(2),
        vi.fn().mockResolvedValue(3),
        vi.fn().mockResolvedValue(4),
        vi.fn().mockResolvedValue(5),
      ];

      const results = await batchOperations(operations, { chunkSize: 2 });

      expect(results).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty operations array", async () => {
      const results = await batchOperations([], { chunkSize: 2 });
      expect(results).toEqual([]);
    });
  });
});
