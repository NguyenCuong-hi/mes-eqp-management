import React from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

import OperationsTable from '../table/EventTable';
import RouteOperationsTable from '../table/EquipmentEventsTable';

const RouteOperationQuery = ({
  defaultColsOp,
  gridDataOp,
  setGridDataOp,
  colsOp,
  setColsOp,
  numRowsOp,
  setNumRowsOp,

  defaultColsRouteOp,
  gridDataRouteOp,
  setGridDataRouteOp,
  colsRouteOp,
  setColsRouteOp,
  numRowsRouteOp,
  setNumRowsRouteOp
}) => {
  const { t } = useTranslation();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <div className="bg-slate-50 rounded-md overflow-auto mb-2">
      <Typography.Title className="border-b-1 uppercase border-gray-400 m-2" style={{ fontSize: 'medium', color: '#6b7280' }}>
        Đăng ký thông tin công đoạn
      </Typography.Title>
      <div className="bg-slate-50 rounded-md h-[500px]  ">
        <Splitter className="w-full h-full mb-0 pb-0">
          <SplitterPanel size={45} minSize={10}>
            <OperationsTable
              defaultCols={defaultColsOp}
              gridData={gridDataOp}
              setGridData={setGridDataOp}
              cols={colsOp}
              setCols={setColsOp}
              numRows={numRowsOp}
              setNumRows={setNumRowsOp}
            />
          </SplitterPanel>

          <SplitterPanel size={55} minSize={10}>
            <RouteOperationsTable
              defaultCols={defaultColsRouteOp}
              gridData={gridDataRouteOp}
              setGridData={setGridDataRouteOp}
              cols={colsRouteOp}
              setCols={setColsRouteOp}
              numRows={numRowsRouteOp}
              setNumRows={setNumRowsRouteOp}
            />
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};

export default RouteOperationQuery;
