// @flow

const { Babel } = window

type Input = {
  code: string,
  plugins: string[],
  presets: string[],
}

type Output = { code: string } | { error: string }

const transformer = ({ code, plugins, presets }: Input): Output => {
  try {
  	return {
      code: Babel.transform(code, { presets, plugins }).code
    }
  } catch (e) {
    return {
      error: e.message
    }
  }
}

export default transformer
