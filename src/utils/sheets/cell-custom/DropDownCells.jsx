import React, { useMemo, useState } from 'react';
import { GridCellKind, getMiddleCenterBias, TextCellEntry, useTheme } from '@glideapps/glide-data-grid';
import Select, { components } from 'react-select';

const DropdownEditor = ({ value: cell, onFinishedEditing, initialValue }) => {
  const { allowedValues, value: selectedValue } = cell.data;
  const [inputValue, setInputValue] = useState(initialValue ?? '');
  const theme = useTheme();

  const options = useMemo(() => {
    return allowedValues.map((val) => ({
      value: val.Value,
      label: val.MinorName
    }));
  }, [allowedValues]);

  if (cell.readonly) {
    return <TextCellEntry highlight autoFocus={false} disabled value={typeof selectedValue === 'string' ? selectedValue : ''} onChange={() => undefined} />;
  }

  

  return (
    <Select
      className="glide-select"
      inputValue={inputValue}
      onInputChange={setInputValue}
      menuPlacement="auto"
      value={options.find((x) => x.value === selectedValue) || null}
      options={options.filter((x) => x.label.toLowerCase().includes(inputValue.toLowerCase()))}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({ ...base, border: 0, boxShadow: 'none' }),
        option: (base) => ({
          ...base,
          fontSize: theme.editorFontSize,
          fontFamily: theme.fontFamily
        })
      }}
      autoFocus
      openMenuOnFocus
      placeholder=""
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      theme={(t) => ({
        ...t,
        colors: {
          ...t.colors,
          neutral0: theme.bgCell,
          neutral20: theme.bgCellMedium,
          neutral80: theme.textDark,
          primary: theme.accentColor
        }
      })}
      onChange={(e) => {
        if (!e) return;

        setTimeout(() => {
          onFinishedEditing({
            ...cell,
            data: {
              ...cell.data,
              value: e.value
            }
          });
        }, 0);
      }}
    />
  );
};

export const DropdownRenderer = {
  kind: GridCellKind.Custom,

  isMatch: (cell) => cell.data.kind === 'dropdown-cell',

  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const { value } = cell.data;

    ctx.fillStyle = theme.textDark;
    ctx.fillText(value, rect.x + theme.cellHorizontalPadding, rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme));

    return true;
  },

  measure: (ctx, cell) => {
    const { value } = cell.data;
    return value ? ctx.measureText(value).width + 16 : 16;
  },

  provideEditor: () => ({
    editor: DropdownEditor,
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: '',
      data: {
        ...v.data,
        value: ''
      }
    })
  }),

  onPaste: (val, data) => ({
  ...data,
  value: data.allowedValues.some((opt) => opt.Value === val) ? val : ''
})
};
