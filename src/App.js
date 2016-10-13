// @flow

import React, { Component } from 'react';
import SelectableList from './SelectableList'
import Repl from './Repl'
import persistence from './persistence'
import { PRESETS, PLUGINS, PRESET_NAMES, CONTAINING_PRESETS } from './data'
import _ from 'lodash'
import './App.css'

const INIT = `class X {
	foo: string = 'bar'
}`

class App extends Component {
	state = {
		presets: {},
		plugins: {},
		code: INIT,
	}

	render() {
		const presets = this.selectedPresets()
		const plugins = this.selectedPlugins()

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
						options={PRESET_NAMES}
						selectedOptions={this.state.presets}
						disabledOptions={presets.reduce((carry, curr) => {
							return [ ...carry, ...(CONTAINING_PRESETS[curr] || []) ]
						}, [])}
						onToggle={this.togglePreset}
					/>

					<h3>Plugins</h3>
					<SelectableList
						options={PLUGINS}
						selectedOptions={this.state.plugins}
						disabledOptions={presets.reduce((carry, curr) => {
							return [ ...carry, ...PRESETS[curr] ]
						}, [])}
						onToggle={this.togglePlugin}
					/>
				</div>

				<Repl
					code={this.state.code}
					presets={presets}
					plugins={plugins}
					onChange={code => this.setState({ code })}
				/>

			</div>
		)
	}

	selectedPresets() {
		return this.selected('presets')
	}

	selectedPlugins() {
		return this.selected('plugins')
	}

	selected(key) {
		return Object.keys(this.state[key]).filter(k => this.state[key][k])
	}

	xcomponentWillMount() {
		this.setState(persistence.load())
	}

	xcomponentDidUpdate() {
		persistence.save({
			code: this.state.code,
			presets: this.presets,
			babili: false, // TODO
			lineWrap: false, // TODO
			evaluate: false, // TODO
		})
	}

	togglePreset = preset => {
		this.setState(state => ({
			presets: _.omit({
				...state.presets,
				[preset]: !state.presets[preset],
			}, CONTAINING_PRESETS[preset]),
			plugins: _.omit(state.plugins, PRESETS[preset]),
		}))
	}

	togglePlugin = plugin => {
		this.setState(state => ({
			plugins: {
				...state.plugins,
				[plugin]: !state.plugins[plugin],
			},
		}))
	}

	showConfig = () => this.setState({ showConfig: true })
	hideConfig = () => this.setState({ showConfig: false })

	generateConfig() {
		const config = {}

		const presets = Object.keys(this.state.presets).filter(k => this.state.presets[k])
		const plugins = Object.keys(this.state.plugins).filter(k => this.state.plugins[k])

		if (presets.length) {
			config.presets = presets
		}

		if (plugins.length) {
			config.plugins = plugins
		}

		return JSON.stringify(config, null, 2)
	}
}

export default App
