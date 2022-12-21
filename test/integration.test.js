import { describe, it, expect, jest } from "@jest/globals";
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";
import CSVToNDJSON from "../src/streamComponents/csvtondjson.js";
import Reporter from "../src/streamComponents/reporter.js";

describe("CSV to NDJSON", () => {
  const reporter = new Reporter();
  it("given a csv stream, it should parse each line to a valid NDJSON string", async () => {
    const csvString = `id,name,desc\n01,John Doe,John Doe's description\n02,John Doe,John Doe's description\n03,John Doe,John Doe's description\n04,John Doe,John Doe's description\n05,John Doe,John Doe's description\n06,John Doe,John Doe's description\n07,John Doe,John Doe's description\n08,John Doe,John Doe's description\n09,John Doe,John Doe's description\n10,John Doe,John Doe's description\n11,John Doe,John Doe's description\n12,John Doe,John Doe's description\n13,John Doe,John Doe's description\n14,John Doe,John Doe's description\n15,John Doe,John Doe's description\n16,John Doe,John Doe's description\n17,John Doe,John Doe's description\n18,John Doe,John Doe's description\n19,John Doe,John Doe's description\n20,John Doe,John Doe's description\n21,John Doe,John Doe's description\n22,John Doe,John Doe's description\n23,John Doe,John Doe's description\n24,John Doe,John Doe's description\n25,John Doe,John Doe's description\n26,John Doe,John Doe's description\n27,John Doe,John Doe's description\n28,John Doe,John Doe's description\n29,John Doe,John Doe's description\n30,John Doe,John Doe's description\n31,John Doe,John Doe's description\n32,John Doe,John Doe's description\n33,John Doe,John Doe's description\n34,John Doe,John Doe's description\n35,John Doe,John Doe's description\n36,John Doe,John Doe's description\n37,John Doe,John Doe's description\n38,John Doe,John Doe's description\n39,John Doe,John Doe's description\n40,John Doe,John Doe's description\n41,John Doe,John Doe's description\n42,John Doe,John Doe's description\n43,John Doe,John Doe's description\n44,John Doe,John Doe's description\n45,John Doe,John Doe's description\n46,John Doe,John Doe's description\n47,John Doe,John Doe's description\n48,John Doe,John Doe's description\n49,John Doe,John Doe's description\n50,John Doe,John Doe's description50`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "desc"],
    });

    const spy = jest.fn();

    await pipeline(
      Readable.from(csvString),
      csvToJSON,
      reporter.progress(csvString.length),
      Writable({
        write(chunk, encoding, callback) {
          spy(chunk);
          callback(null, chunk);
        },
      })
    );

    const times = csvString.split("\n").length - 1; // -headers
    expect(spy).toBeCalledTimes(times);

    const [firstCall] = spy.mock.calls[0];
    const [lastCall] = spy.mock.calls[times - 1];
    expect(JSON.parse(firstCall)).toStrictEqual({
      id: "01",
      name: "John Doe",
      desc: "John Doe's description",
    });

    expect(JSON.parse(lastCall)).toStrictEqual({
      id: "50",
      name: "John Doe",
      desc: "John Doe's description50",
    });
  });
});
