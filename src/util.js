import readline from "node:readline";

function log(msg, options = { sameline: true }) {
  if (options.sameline) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(msg);
  } else {
    console.log(`\n${msg}`);
  }
}

export { log };
