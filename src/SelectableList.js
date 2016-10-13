// @flow

import React from 'react'

type Props = {
  options: string[],
  selectedOptions: { [option: string]: boolean },
  disabledOptions: string[],
  onToggle: (option: string) => any,
}

const ListItem = ({ disabled, selected, onClick, option }) =>
  disabled ? (
    <li>
			<input type="checkbox" checked disabled />
			<label>{option}</label>
    </li>
  ) : (
    <li>
  		<input type="checkbox" checked={selected} onChange={() => onClick(option)} />
  		<label onClick={() => onClick(option)}>{option}</label>
    </li>
  )

const SelectableList = ({ options, selectedOptions, disabledOptions = [], onToggle }: Props) => (
	<ul>
		{options.map(opt => (
      <ListItem
        key={opt}
        option={opt}
        disabled={disabledOptions.includes(opt)}
        selected={selectedOptions[opt] || false}
        onClick={onToggle}
      />
		))}
	</ul>
)

export default SelectableList
