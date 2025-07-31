import { Typography } from 'antd';
import CategoryTable from 'component/Sheets/CategoryTable';
import React, { useCallback } from 'react';
import { updateEditedRows } from 'utils/sheets/updateEditedRows';

const ModelGroupCategory = ({
  dataCategoryValue,
  defaultCols,
  gridData,
  setGridData,
  cols,
  setCols,
  numRows,
  setNumRows,
  handleRowAppend,
  setEditedRows,
  selectionCategory,
  setSelectionCategory,
  onCellCategoryClicked,
  canEdit
}) => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };


  const cellConfig = {};
  return (
    <div className="bg-slate-50  h-[calc(100vh-189px)]">
      <CategoryTable
        dataCategoryValue={dataCategoryValue}
        defaultCols={defaultCols}
        gridData={gridData}
        setGridData={setGridData}
        cols={cols}
        setCols={setCols}
        numRows={numRows}
        setNumRows={setNumRows}
        cellConfig={cellConfig}
        handleRowAppend={handleRowAppend}
        setEditedRows={setEditedRows}
        selection={selectionCategory}
        setSelection={setSelectionCategory}
        onCellClicked={onCellCategoryClicked}
      />
    </div>
  );
};

export default ModelGroupCategory;
