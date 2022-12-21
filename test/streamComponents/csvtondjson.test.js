import { describe, it, expect } from "@jest/globals";

import CSVToNDJSON from "../../src/streamComponents/csvtondjson.mjs";

/**
 * id, name -> headers
 * 1, foo -> data
 * ...
 */

describe("CSV to NDJSON test suite", () => {
  it.todo("given a csv string it should return a ndjson string");
  it.todo(
    "it should work with strings that doesn't contains breaklines at the end"
  );
  it.todo(
    "it should work with files that has breaklines in the beginning of the string "
  );
});
