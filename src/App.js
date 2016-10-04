import React, { Component } from 'react';
import './App.css';

const { Babel } = window;

const PLUGINS = [
	'check-es2015-constants',
	'external-helpers-2',
	'syntax-async-functions',
	'syntax-async-generators',
	'syntax-class-constructor-call',
	'syntax-class-properties',
	'syntax-decorators',
	'syntax-do-expressions',
	'syntax-exponentiation-operator',
	'syntax-export-extensions',
	'syntax-flow',
	'syntax-function-bind',
	'syntax-function-sent',
	'syntax-jsx',
	'syntax-object-rest-spread',
	'syntax-trailing-function-commas',
	'transform-async-functions',
	'transform-async-to-generator',
	'transform-async-to-module-method',
	'transform-class-constructor-call',
	'transform-class-properties',
	'transform-decorators',
	'transform-decorators-legacy',
	'transform-do-expressions',
	'transform-es2015-arrow-functions',
	'transform-es2015-block-scoped-functions',
	'transform-es2015-block-scoping',
	'transform-es2015-classes',
	'transform-es2015-computed-properties',
	'transform-es2015-destructuring',
	'transform-es2015-duplicate-keys',
	'transform-es2015-for-of',
	'transform-es2015-function-name',
	'transform-es2015-instanceof',
	'transform-es2015-literals',
	'transform-es2015-modules-amd',
	'transform-es2015-modules-commonjs',
	'transform-es2015-modules-systemjs',
	'transform-es2015-modules-umd',
	'transform-es2015-object-super',
	'transform-es2015-parameters',
	'transform-es2015-shorthand-properties',
	'transform-es2015-spread',
	'transform-es2015-sticky-regex',
	'transform-es2015-template-literals',
	'transform-es2015-typeof-symbol',
	'transform-es2015-unicode-regex',
	'transform-es3-member-expression-literals',
	'transform-es3-property-literals',
	'transform-es5-property-mutators',
	'transform-eval',
	'transform-exponentiation-operator',
	'transform-export-extensions',
	'transform-flow-comments',
	'transform-flow-strip-types',
	'transform-function-bind',
	'transform-jscript',
	'transform-object-assign',
	'transform-object-rest-spread',
	'transform-object-set-prototype-of-to-assign',
	'transform-proto-to-assign',
	'transform-react-constant-elements',
	'transform-react-display-name',
	'transform-react-inline-elements',
	'transform-react-jsx',
	'transform-react-jsx-compat',
	'transform-react-jsx-self',
	'transform-react-jsx-source',
	'transform-regenerator',
	'transform-runtime',
	'transform-strict-mode',
	'undeclared-variables-check',
]

const PRESETS = {
	'es2015': {
		"check-es2015-constants": true,
		"transform-es2015-arrow-functions": true,
		"transform-es2015-block-scoped-functions": true,
		"transform-es2015-block-scoping": true,
		"transform-es2015-classes": true,
		"transform-es2015-computed-properties": true,
		"transform-es2015-destructuring": true,
		"transform-es2015-duplicate-keys": true,
		"transform-es2015-for-of": true,
		"transform-es2015-function-name": true,
		"transform-es2015-literals": true,
		// "transform-es2015-modules-amd": true,
		"transform-es2015-modules-commonjs": true,
		// "transform-es2015-modules-systemjs": true,
		// "transform-es2015-modules-umd": true,
		"transform-es2015-object-super": true,
		"transform-es2015-parameters": true,
		"transform-es2015-shorthand-properties": true,
		"transform-es2015-spread": true,
		"transform-es2015-sticky-regex": true,
		"transform-es2015-template-literals": true,
		"transform-es2015-typeof-symbol": true,
		"transform-es2015-unicode-regex": true,
		"transform-regenerator": true,
	},
	'es2016': [
	],
	'es2017': [
	],
	'latest': [
	],
	'react': [
	],
	'stage-0': [
	],
	'stage-1': [
	],
	'stage-2': [
	],
	'stage-3': [
	],
	// 'es2015-no-common-js',
	// 'es2015-loose',
}

class App extends Component {
	state = {
		presets: {},
		plugins: {},
	}

	togglePreset = preset => {
		this.setState({
			presets: {
				...this.state.presets,
				[preset]: !this.state.presets[preset],
			},
			plugins: {
				...this.state.plugins,
				...PRESETS[preset],
			}
		})
	}

	render() {
		const { code, error } = this.transformed

		return (
			<div className="repl">
				<div className="repl-options">
					<h3>Presets</h3>
					<ul>
						{Object.keys(PRESETS).map(preset => (
							<li key={preset}>
								<input
									type="checkbox"
									value={this.state.presets[preset]}
									onChange={() => this.togglePreset(preset)}
								/>
								{preset}
							</li>
						))}
					</ul>

					<h3>Plugins</h3>
					<ul>
						{PLUGINS.map(plugin => (
							<li key={plugin}>
								<input
									type="checkbox"
									value={this.state.plugins[plugin]}
									onChange={() => {
										this.setState({
											plugins: {
												...this.state.plugins,
												[plugin]: !this.state.plugins[plugin],
											},
										})
									}}
								/>
								{plugin}
							</li>
						))}
					</ul>
				</div>

				<div className="repl-main">
					<h3>Input</h3>
					<textarea value={this.state.code} onChange={e => this.setState({ code: e.target.value })}></textarea>

					<h3>Output</h3>
					<textarea disabled value={code}></textarea>

					{error && <pre>{error}</pre>}
				</div>

			</div>
		)
	}

	previousOutput = ''

	get transformed() {
		try {
			const presets = Object.keys(this.state.presets).filter(k => this.state.presets[k])
			const plugins = Object.keys(this.state.plugins).filter(k => this.state.plugins[k])

			this.previousOutput = Babel.transform(this.state.code, { presets, plugins }).code

			return {
				code: this.previousOutput,
				error: null,
			}
		} catch (e) {
			return {
				code: this.previousOutput,
				error: e.message,
			}
		}
	}
}

export default App
