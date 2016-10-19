// @flow

import React from "react";
import ReactAce from "react-ace";
import "brace/mode/javascript";
import "brace/theme/tomorrow";

type Props = {
  name: string,
  value: string,
  onChange?: (value: string) => any
}

const Editor = ({ name, value, onChange }: Props) => (
	<ReactAce
		onChange={onChange}
		value={value}
    name={name}
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
);

export default Editor;
