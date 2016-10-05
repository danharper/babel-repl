import React, { Component } from 'react';
import ReactAce from 'react-ace';
import prettyFormat from 'pretty-format'
import './App.css';
import 'brace/mode/javascript'
import 'brace/theme/tomorrow'

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

const PRESET_NAMES = Object.keys(PRESETS)

const INIT = `class X {
	foo: string = 'bar'
}`

const Editor = ({ name, value, onChange }) => (
	<ReactAce
		onChange={onChange}
		value={value} name={name}
		readOnly={!onChange}
		height="100%"
		width="100%"
		mode="javascript"
		theme="tomorrow"
		tabSize={2}
		showPrintMargin={false}
		setOptions={{
			useSoftTabs: true,
			useWorker: false,
		}}
	/>
)

const SelectableList = ({ options, selectedOptions, onToggle }) => (
	<ul>
		{options.map(opt => (
			<li key={opt}>
				<input
					type="checkbox"
					checked={selectedOptions[opt] || false}
					onChange={() => onToggle(opt)}
				/>
				<label onClick={() => onToggle(opt)}>
					{opt}
				</label>
			</li>
		))}
	</ul>
)

class App extends Component {
	state = {
		presets: {},
		plugins: {},
		code: INIT,
	}

	togglePreset = preset => {
		this.setState(state => ({
			presets: {
				...state.presets,
				[preset]: !state.presets[preset],
			},
			plugins: {
				...state.plugins,
				...PRESETS[preset],
			}
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

		return config
	}

	render() {
		const { code, error, evaluated } = this.transformed

		return (
			<div className="repl">
				{this.state.showConfig && (
					<dialog open={true} className="dialog">
						<button onClick={() => this.setState({ showConfig: false })}>Close</button>
						<pre>{JSON.stringify(this.generateConfig(), null, 2)}</pre>
					</dialog>
				)}

				<div className="repl-options">
					<button onClick={() => this.setState({ showConfig: true })}>Gen</button>
					<h3>Presets</h3>
					<SelectableList
						options={PRESET_NAMES}
						selectedOptions={this.state.presets}
						onToggle={this.togglePreset}
					/>

					<h3>Plugins</h3>
					<SelectableList
						options={PLUGINS}
						selectedOptions={this.state.plugins}
						onToggle={this.togglePlugin}
					/>
				</div>

				<div className="repl-main">
					<div className="repl-box repl-input">
						<Editor
							onChange={code => this.setState({ code })}
							value={this.state.code}
							name="input-editor"
						/>
						{error && <pre className="error">{error}</pre>}
					</div>

					<div className="repl-box repl-output">
						<Editor
							value={code}
							name="output-editor"
						/>
						{evaluated && <pre className="evaluated">{evaluated}</pre>}
					</div>

				</div>

			</div>
		)
	}

	previous = { code: '', evaluated: '' }

	get presets() {
		return Object.keys(this.state.presets).filter(k => this.state.presets[k])
	}

	get plugins() {
		return Object.keys(this.state.plugins).filter(k => this.state.plugins[k])
	}

	get transformed() {
		try {
			const presets = this.presets
			const plugins = this.plugins

			const code = Babel.transform(this.state.code, { presets, plugins }).code
			const evaluated = this.evaluate(code)

			this.previous = { code, evaluated }

			return {
				code,
				evaluated,
				error: null,
			}
		} catch (e) {
			return {
				code: this.previous.code,
				evalOutput: this.previous.evaluated,
				error: e.message,
			}
		}
	}

	evaluate(code) {
		const capturingConsole = Object.create(console)
		let buffer = []
		let done = false

		const flush = () => {
			// $dom.text(buffer.join('\n')) // ...
			// TODO: this just updated the DOM, and it's useful for async logs...
		}
		const write = line => {
			buffer.push(line)
			if (done) {
				flush()
			}
		}

		const capture = (...args) => {
			write(args.map(line => prettyFormat(line)).join(' '))
		}

		capturingConsole.clear = () => {
			buffer = []
			flush()
			console.clear()
		}

		['error', 'log', 'info', 'debug'].forEach(key => {
			capturingConsole[key] = (...args) => {
				console[key](...args)
				capture(...args)
			}
		})

		try {
			new Function('console', code)(capturingConsole) // eslint-disable-line no-new-func
		} catch (err) {
			buffer.push(err.message)
		}

		done = true

		return buffer.join('\n')
	}

	xcomponentWillMount() {
		const lsState = this.decodeStorage() || {}
		const urlState = this.parseQuery() || {}

		this.setState({
			babili: false,
			evaluate: true,
			lineWrap: false,
			presets: { es2015: true, 'stage-2': true, react: true },
			...lsState,
			...urlState
		})
	}

	decodeStorage() {
		try {
			return JSON.parse(window.localStorage.getItem('replState'))
		} catch (e) {
			return null
		}
	}

	parseQuery() {
		const query = window.location.hash.replace(/^\#\?/, '')

		if (!query) return null

		return query.split('&').map(param => {
			const splitPoint = param.indexOf('=')
			return {
				key: param.substring(0, splitPoint),
				value: param.substring(splitPoint + 1)
			}
		}).reduce((carry, { key, value }) => {
			if (key && value) {
				try {
					carry[key] = window.decodeURIComponent(String(value))
				} catch (e) {}
			}
		})
	}

	componentDidUpdate() {
		const state = {
			code: this.state.code,
			presets: this.presets,
			babili: false, // TODO
			lineWrap: false, // TODO
			evaluate: false, // TODO
		}

		try {
			window.localStorage.setItem('replState', JSON.stringify(state))
		} catch (e) {}

		// TODO: handle presets better here
		// existing code does [a,b,c], we need { a: true, b: true, c: true }
		const query = Object.keys(state)
			.map(key => `${key}=${window.encodeURIComponent(state[key])}`)
			.join('&')

		window.location.hash = '?' + query
	}
}

export default App
