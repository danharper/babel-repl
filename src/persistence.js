// @flow

type SavedState = {
  code: string,
  presets: string[],
  plugins: string[],
}

const parseQuery = () => {
  const query = window.location.hash.replace(/^#\?/, "");

  if (!query) return null;

  return query.split("&").map((param) => {
    const splitPoint = param.indexOf("=");
    return {
      key: param.substring(0, splitPoint),
      value: param.substring(splitPoint + 1)
    };
  }).reduce((carry, { key, value }) => {
    if (key && value) {
      try {
        carry[key] = window.decodeURIComponent(String(value));
      } catch (e) {}
    }
    return carry;
  });
};

const decodeStorage = () => {
  try {
    return JSON.parse(window.localStorage.getItem("replState"));
  } catch (e) {
    return null;
  }
};

const load = (): ?SavedState => {
  const lsState = decodeStorage() || {};
  const urlState = parseQuery() || {};
  return {
    babili: false,
    evaluate: true,
    lineWrap: false,
    presets: { es2015: true, "stage-2": true, react: true },
    ...lsState,
    ...urlState
  };
};

const save = (state: SavedState) => {
  try {
    window.localStorage.setItem("replState", JSON.stringify(state));
  } catch (e) {}

	// TODO: handle presets better here
	// existing code does [a,b,c], we need { a: true, b: true, c: true }
  const query = Object.keys(state)
		.map((key) => `${key}=${window.encodeURIComponent(state[key])}`)
		.join("&");

  window.location.hash = "?" + query;
};

export default { load, save };
