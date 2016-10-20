import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

describe("App", () => {
  let div;

  beforeEach(() => {
    div = document.createElement("div");
    document.body.appendChild(div);
  });

  it("renders without crashing", () => {
    ReactDOM.render(<App />, div);
  });

  afterEach(() => {
    document.body.removeChild(div);
  });
});
