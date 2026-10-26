import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, test } from "vitest";

const MIN_FIXED_VERSION = [8, 3, 3];

function parseVersion(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10));
}

function isGte(actual: number[], minimum: number[]): boolean {
  const length = Math.max(actual.length, minimum.length);
  for (let i = 0; i < length; i += 1) {
    const a = actual[i] ?? 0;
    const b = minimum[i] ?? 0;
    if (a > b) return true;
    if (a < b) return false;
  }
  return true;
}

describe("vite security advisory GHSA-587h-7wmj-h5pm", () => {
  test("installed vite is patched to >= 8.3.3", () => {
    const require = createRequire(import.meta.url);
    const vitePackage = JSON.parse(
      readFileSync(require.resolve("vite/package.json"), "utf8"),
    ) as { version: string };

    const actual = parseVersion(vitePackage.version);
    expect(isGte(actual, MIN_FIXED_VERSION)).toBe(true);
  });
});
