import { log } from "../util.js";
import { PassThrough } from "node:stream";

// Buffer.from('1,erick-1,1-text,1').byteLength
// Buffer.from('{"id":0,"name":"erick-1","desc":"1-text","age":"1"}').byteLength
// Buffer.from('//{"id":499999,"name":"erick-5","desc":"5-text","age":"5"}').byteLength

const A_HUNDRED_PERCENT = 100;
export default class Reporter {
  #loggerFn;
  // TODO:dynamically set the delta value to be used in the progress bar
  LINE_LENGTH_AFTER_TURNED_TO_JSON = 40;
  constructor({ logger = log } = {}) {
    this.#loggerFn = logger;
  }

  #onData(amount) {
    let totalChunks = 0;
    return (chunk) => {
      totalChunks += chunk.length - this.LINE_LENGTH_AFTER_TURNED_TO_JSON;
      const processed = (A_HUNDRED_PERCENT * totalChunks) / amount;
      this.#loggerFn(`processed: ${processed.toFixed(2)}%`);
    };
  }

  progress(amount) {
    const progress = new PassThrough();
    progress.on("data", this.#onData(amount));
    progress.on("end", () => {
      this.#loggerFn(`processed: ${A_HUNDRED_PERCENT}.00%`, {
        sameline: false,
      });
    });

    return progress;
  }
}
