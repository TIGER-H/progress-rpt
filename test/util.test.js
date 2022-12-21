import { describe, it, expect, jest, afterAll } from "@jest/globals";
import readline from "node:readline";
import { log } from "../src/util.js";

describe("Log Test Suite", () => {
  readline.cursorTo = jest.fn().mockImplementation();
  process.stdout.write = jest.fn().mockImplementation();

  afterAll(() => jest.clearAllMocks());

  it("writeInput", () => {
    const msg = "test";
    log(msg);
    expect(readline.cursorTo).toBeCalledWith(process.stdout, 0);
    expect(process.stdout.write).toBeCalledWith(msg);
  });
});
