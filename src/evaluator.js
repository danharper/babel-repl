// @flow

import prettyFormat from "pretty-format";

const evaluate = (code: string): string => {
  const capturingConsole = Object.create(console);
  let buffer = [];
  let done = false;

  const flush = () => {
		// $dom.text(buffer.join('\n')) // ...
		// TODO: this just updated the DOM, and it's useful for async logs...
  };
  const write = (line) => {
    buffer.push(line);
    if (done) {
      flush();
    }
  };

  const capture = (...args) => {
    write(args.map((line) => prettyFormat(line)).join(" "));
  };

  capturingConsole.clear = () => {
    buffer = [];
    flush();
    console.clear();
  };

  ["error", "log", "info", "debug"].forEach((key) => {
    capturingConsole[key] = (...args) => {
      console[key](...args);
      capture(...args);
    };
  });

  try {
    new Function("console", code)(capturingConsole); // eslint-disable-line no-new-func
  } catch (err) {
    buffer.push(err.message);
  }

  done = true;

  return buffer.join("\n");
};

export default evaluate;
