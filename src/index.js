/**
 * echo "id,name,desc,age" > big.csv
 * for i in `seq 1 1000000`; do node -e "process.stdout.write('$i,htg-$i,desc-$i,$i'.repeat(1e5))" >> big.csv; done
 */

import { statSync, createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import CSVToNDJSON from "./streamComponents/csvtondjson.js";
import Reporter from "./streamComponents/reporter.js";
import { log } from "./util.js";

const reporter = new Reporter();
const filename = "big.csv";

const { size: fileSize } = statSync(filename);

let counter = 0;

const processData = Transform({
  transform(chunk, encoding, callback) {
    const data = JSON.parse(chunk);
    const result = JSON.stringify({
      ...data,
      id: counter++,
    }).concat("\n");

    return callback(null, result);
  },
});

const csvToJSON = new CSVToNDJSON({
  delimeter: ",",
  headers: ["id", "name", "desc", "age"],
});

const startedAt = Date.now();
await pipeline(
  createReadStream(filename),
  csvToJSON,
  processData,
  reporter.progress(fileSize),
  createWriteStream("big.json")
);

const A_MILLISECOND = 1000;
const A_MINUTE = 60;

const timeInSeconds = Math.round(
  (Date.now() - startedAt) / A_MILLISECOND
).toFixed(2);
const finalTime =
  timeInSeconds > A_MILLISECOND
    ? `${timeInSeconds / A_MINUTE}m`
    : `${timeInSeconds}s`;
log(
  `took: ${finalTime} - processed items ${counter} - process finished with success!`
);
