import React, { useMemo, useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import OperationPropertiesTable from '../table/OperationPropertiesTable';
import OperationManageInfo from './OperationManageInfo';

const OperationBasInfo = ({
  formBasic,
  dataUnit,
  dataStep,
  dataLossTable,
  dataSuccessTable,
  dataReworkTable,
  defaultColsOpRoute,
  gridDataOpRoute,
  setGridDataOpRoute,
  colsRouteOp,
  setColsRouteOp,
  numRowsRouteOp,
  setNumRowsRouteOp,

  selectionRouteOp,
  setSelectionRouteOp,
  onCellRouteOpClicked
}) => {
  return (
    <div className="bg-slate-50  h-[calc(100vh-189px)]">
      <Splitter className="w-full h-full ">
        <SplitterPanel size={50} minSize={10}>
          <OperationManageInfo
            formBasic={formBasic}
            dataUnit={dataUnit}
            dataStep={dataStep}
            dataLossTable={dataLossTable}
            dataSuccessTable={dataSuccessTable}
            dataReworkTable={dataReworkTable}
          />
        </SplitterPanel>

        <SplitterPanel size={50} minSize={10}>
          <OperationPropertiesTable
            defaultCols={defaultColsOpRoute}
            gridData={gridDataOpRoute}
            setGridData={setGridDataOpRoute}
            cols={colsRouteOp}
            setCols={setColsRouteOp}
            numRows={numRowsRouteOp}
            setNumRows={setNumRowsRouteOp}
            selection={selectionRouteOp}
            setSelection={setSelectionRouteOp}
            onCellClicked={onCellRouteOpClicked}
          />
        </SplitterPanel>
      </Splitter>
    </div>
  );
};

export default OperationBasInfo;
