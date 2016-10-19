// @flow

import React from "react";
import Editor from "./Editor";
import transformer from "./transformer";
import evaluator from "./evaluator";

let previous = { output: "", evaluated: "" };

const run = (input) => {
  const result = transformer(input);

  if (result.code) {
    return previous = {
      output: result.code,
      evaluated: evaluator(result.code),
      error: null,
    };
  } else {
    return {
      output: previous.output,
      evaluated: previous.evaluated,
      error: result.error,
    };
  }
};

const Repl = ({ code, onChange, presets, plugins, options }: Props) => {
  const { output, evaluated, error } = run({ code, presets, plugins, options });

  return (
    <div className="repl-main">
      <div className="repl-box repl-input">
        <Editor value={code} name="input-editor" onChange={onChange} />
        {error && <pre className="error">{error}</pre>}
      </div>

      <div className="repl-box repl-output">
        <Editor value={output} name="output-editor" />
        {evaluated && <pre className="evaluated">{evaluated}</pre>}
      </div>
    </div>
  );
};

export default Repl;
