import { Typography } from 'antd';
import React from 'react';
import OperationReworkTable from '../table/OperationReworkTable';

const MachineReworkQuery = ({
  defaultCols,
  gridData,
  setGridData,
  cols,
  setCols,
  numRows,
  setNumRows,
  onCellEdited,
  cellConfig,
  handleRowAppend
}) => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  return (
    <div className="bg-slate-50 rounded-md overflow-auto mb-2 pb-2">
      <Typography.Title className="border-b-1 uppercase border-gray-400 m-2" style={{ fontSize: 'medium', color: '#6b7280' }}>
        Đăng ký thông tin Rework
      </Typography.Title>
      <div className="bg-slate-50 rounded-md h-96 ">
        <OperationReworkTable
          defaultCols={defaultCols}
          gridData={gridData}
          setGridData={setGridData}
          cols={cols}
          setCols={setCols}
          numRows={numRows}
          setNumRows={setNumRows}
          onCellEdited={onCellEdited}
          cellConfig={cellConfig}
          handleRowAppend={handleRowAppend}
        />
      </div>
    </div>
  );
};

export default MachineReworkQuery;
