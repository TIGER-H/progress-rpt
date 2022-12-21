import { describe, it, expect, jest } from "@jest/globals";

import CSVToNDJSON from "../../src/streamComponents/csvtondjson.mjs";

/**
 * id, name -> headers
 * 1, foo -> data
 * ...
 */

describe("CSV to NDJSON test suite", () => {
  it("given a csv string it should return a ndjson string", () => {
    const csvString = `id,name,age\n01,foo,20\n`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "age"],
    });

    const expected = JSON.stringify({ id: "01", name: "foo", age: "20" });

    const fn = jest.fn();
    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvToJSON.end();

    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected));
  });

  // undefined is not iterable (cannot read property Symbol(Symbol.iterator))
  // means: it never calls the function
  it("it should work with strings that doesn't contains breaklines at the end", () => {
    const csvString = `id,name,age\n01,foo,20`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "age"],
    });

    const expected = JSON.stringify({ id: "01", name: "foo", age: "20" });

    const fn = jest.fn();
    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvToJSON.end();

    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected));
  });

  it("it should work with files that has breaklines in the beginning of the string", () => {
    const csvString = `\n\nid,name,age\n\n\n01,foo,20\n02,bar,30\n03,baz,40\n\n\n`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "age"],
    });

    const expected = [
      JSON.stringify({ id: "01", name: "foo", age: "20" }),
      JSON.stringify({ id: "02", name: "bar", age: "30" }),
      JSON.stringify({ id: "03", name: "baz", age: "40" }),
    ];

    const fn = jest.fn();
    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvToJSON.end();

    const [first, second, three] = fn.mock.calls;
    expect(JSON.parse(first)).toStrictEqual(JSON.parse(expected[0]));
    expect(JSON.parse(second)).toStrictEqual(JSON.parse(expected[1]));
    expect(JSON.parse(three)).toStrictEqual(JSON.parse(expected[2]));
  });
});
