// @flow

import React, { Component } from "react";
import SelectableList from "./SelectableList";
import Repl from "./Repl";
import persistence from "./persistence";
import mergeOptions from "./mergeOptions";
import { PRESETS, PLUGINS, PRESET_NAMES, CONTAINING_PRESETS } from "./data";
import _ from "lodash";
import "./App.css";

const INIT = `class X {
  foo: string = 'bar'
}`;

class App extends Component {
  state = {
    presets: {},
    plugins: {},
    code: INIT,
    options: {},
  }

  render() {
    const presets = this.selectedPresets();
    const plugins = this.selectedPlugins();
    const { options } = this.state;

    return (
      <div className="repl">
        {this.state.showConfig && (
          <dialog open={true} className="dialog">
            <button onClick={this.hideConfig}>Close</button>
            <pre>{this.generateConfig()}</pre>
          </dialog>
        )}

        <div className="repl-options">
          <button onClick={this.showConfig}>Gen</button>
          <h3>Presets</h3>
          <SelectableList
            items={PRESET_NAMES}
            selected={this.state.presets}
            disabled={presets.reduce((carry, curr) => (
              [ ...carry, ...(CONTAINING_PRESETS[curr] || []) ]
            ), [])}
            onItemToggle={this.togglePreset}
            options={options}
            onOptionToggle={this.togglePresetOption}
            onOptionChange={this.handlePresetOptionChanged}
          />

          <h3>Plugins</h3>
          <SelectableList
            items={PLUGINS}
            selected={this.state.plugins}
            disabled={presets.reduce((carry, curr) => (
              [ ...carry, ...PRESETS[curr] ]
            ), [])}
            onItemToggle={this.togglePlugin}
            options={options}
          />
        </div>

        <Repl
          code={this.state.code}
          presets={presets}
          plugins={plugins}
          options={options}
          onChange={(code) => this.setState({ code })}
        />

      </div>
    );
  }

  selectedPresets() {
    return this.selected("presets");
  }

  selectedPlugins() {
    return this.selected("plugins");
  }

  selected(key) {
    return Object.keys(this.state[key]).filter((k) => this.state[key][k]);
  }

  xcomponentWillMount() {
    this.setState(persistence.load());
  }

  xcomponentDidUpdate() {
    persistence.save({
      code: this.state.code,
      presets: this.presets,
      babili: false, // TODO
      lineWrap: false, // TODO
      evaluate: false, // TODO
    });
  }

  updatePresetOption = (preset, changes) => {
    this.setState({
      options: {
        ...this.state.options,
        [preset]: {
          ...this.state.options[preset],
          ...changes,
        }
      }
    });
  }

  togglePresetOption = (preset) => {
    this.updatePresetOption(preset, {
      enabled: this.state.options[preset] ? !this.state.options[preset].enabled : true,
    });
  }

  handlePresetOptionChanged = (preset, opts) => {
    this.updatePresetOption(preset, {
      value: opts,
    });
  }

  togglePreset = (preset) => {
    this.setState((state) => ({
      presets: _.omit({
        ...state.presets,
        [preset]: !state.presets[preset],
      }, CONTAINING_PRESETS[preset]),
      plugins: _.omit(state.plugins, PRESETS[preset]),
    }));
  }

  togglePlugin = (plugin) => {
    this.setState((state) => ({
      plugins: {
        ...state.plugins,
        [plugin]: !state.plugins[plugin],
      },
    }));
  }

  showConfig = () => this.setState({ showConfig: true })
  hideConfig = () => this.setState({ showConfig: false })

  generateConfig() {
    const config = {};

    const presets = Object.keys(this.state.presets).filter((k) => this.state.presets[k]);
    const plugins = Object.keys(this.state.plugins).filter((k) => this.state.plugins[k]);
    const { options } = this.state;

    if (presets.length) {
      config.presets = mergeOptions(presets, options);
    }

    if (plugins.length) {
      config.plugins = mergeOptions(plugins, options);
    }

    return JSON.stringify(config, null, 2);
  }
}

export default App;
