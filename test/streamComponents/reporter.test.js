import { describe, it, expect, jest } from "@jest/globals";
import Reporter from "../../src/streamComponents/reporter.js";

describe("Reporter Test Suite", () => {
  it("it should print progress status correctly", () => {
    const loggerMock = jest.fn();
    const reporter = new Reporter({
      // console.log
      logger: loggerMock,
    });

    // file size does not change here
    reporter.LINE_LENGTH_AFTER_TURNED_TO_JSON = 0;

    const multiple = 10;
    const progress = reporter.progress(multiple);

    for (let i = 1; i < multiple; i++) {
      progress.write("1");
    }

    progress.emit("end");
    expect(loggerMock).toBeCalledTimes(multiple);

    for (const idx in loggerMock.mock.calls) {
      const [call] = loggerMock.mock.calls[idx];
      const expected = (Number(idx) + 1) * multiple;

      expect(call).toStrictEqual(`processed: ${expected}.00%`);
    }
  });
});
