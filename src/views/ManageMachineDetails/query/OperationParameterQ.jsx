import { Col, Form, Input, Radio, Row, Select, Typography } from 'antd';
import CategoryTable from 'component/Sheets/CategoryTable';
import React from 'react';

const RouteParameterQuery = ({
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
    <div className="bg-slate-50 rounded-md overflow-auto ">
      <Typography.Title className="border-b-1 uppercase border-gray-400 m-2" style={{ fontSize: 'medium', color: '#6b7280' }}>
        Đăng ký thông tin danh mục dây chuyền
      </Typography.Title>
      <div className="bg-slate-50 rounded-md h-95 ">
        <CategoryTable
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

export default RouteParameterQuery;
