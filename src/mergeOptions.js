// @flow

const mergeOptions = (plugins, options) => {
  return plugins.map((name) => {
    if (options[name] && options[name].enabled) {
      return [name, options[name].value];
    } else {
      return name;
    }
  });
};

export default mergeOptions;
