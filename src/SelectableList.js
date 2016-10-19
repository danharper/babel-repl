// @flow

import React from "react";

type Props = {
  items: string[],
  selected: { [option: string]: boolean },
  disabled: string[],
  onItemToggle: (option: string) => any,
}

const OptionsList = ({ item, options, onOptionToggle, onOptionChange }) => {
  const enabled = options ? options.enabled : false;

  return (
    <div style={{ display: "inline" }}>
      <input type="checkbox" checked={enabled} onChange={() => onOptionToggle(item)} />
      {enabled && (
        <textarea
          defaultValue={options.value ? JSON.stringify(options.value) : ""}
          onBlur={(e) => onOptionChange(item, JSON.parse(e.target.value))}
        />
      )}
    </div>
  );
};

const ListItem = ({ disabled, selected, onClick, item, options, onOptionToggle, onOptionChange }) => {
  return disabled ? (
    <li>
			<input type="checkbox" checked disabled />
			<label>{item}</label>
    </li>
  ) : (
    <li>
      <input type="checkbox" checked={selected} onChange={() => onClick(item)} />
      <label onClick={() => onClick(item)}>{item}</label>
      {selected && (
        <OptionsList
          item={item}
          options={options[item]}
          onOptionToggle={onOptionToggle}
          onOptionChange={onOptionChange}
        />
      )}
    </li>
  );
};

const SelectableList = ({
  items,
  selected,
  disabled = [],
  onItemToggle,
  options,
  onOptionToggle,
  onOptionChange
}: Props) => (
	<ul>
		{items.map((opt) => (
      <ListItem
        key={opt}
        item={opt}
        disabled={disabled.includes(opt)}
        selected={selected[opt] || false}
        onClick={onItemToggle}
        options={options}
        onOptionToggle={onOptionToggle}
        onOptionChange={onOptionChange}
      />
		))}
	</ul>
);

export default SelectableList;
