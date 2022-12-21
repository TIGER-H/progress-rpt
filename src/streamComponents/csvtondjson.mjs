import { Transform } from "node:stream";

export default class CSVToNDJSON extends Transform {
  #delimeter = "";
  #headers = [];

  constructor({ delimiter = ",", headers }) {
    super();
    this.#delimeter = delimiter;
    this.#headers = headers;
  }

  _transform(chunk, encoding, cb) {
    cb(null, chunk);
  }

  // when it finishes processing
  // this.push(null) on the readable side
  _final(cb) {
    cb();
  }
}
