import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, test } from "vitest";

const MIN_FIXED_VERSION = [4, 6, 6];

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

describe("zod security advisory GHSA-mrhx-c7xc-m3w5", () => {
  test("installed zod is patched to >= 4.6.6", () => {
    const require = createRequire(import.meta.url);
    const zodPackage = JSON.parse(
      readFileSync(require.resolve("zod/package.json"), "utf8"),
    ) as { version: string };

    const actual = parseVersion(zodPackage.version);
    expect(isGte(actual, MIN_FIXED_VERSION)).toBe(true);
  });
});
