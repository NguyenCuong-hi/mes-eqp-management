import React, { useMemo, useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import RouteTable from '../table/OperationTable';
import ModelRouteDetailsTable from '../table/RouteOperationDetailsTable';
import OperationTable from '../table/OperationTable';
import RouteOperationDetailsTable from '../table/RouteOperationDetailsTable';

const OperationEquipment = ({
  defaultCols,
  gridData,
  setGridData,
  cols,
  setCols,
  numRows,
  setNumRows,
  defaultColsOpRoute,
  gridDataOpRoute,
  setGridDataOpRoute,
  colsRouteOp,
  setColsRouteOp,
  numRowsRouteOp,
  setNumRowsRouteOp,
  onVisibleRegionChanged,
  onCellRouteClicked,
  selection,
  setSelection,

  selectionRouteOp,
  setSelectionRouteOp,
  onCellRouteOpClicked
}) => {

  
  return (
      <div className="bg-slate-50  h-[calc(100vh-189px)]">
        <Splitter className="w-full h-full ">
          <SplitterPanel size={50} minSize={10}>
            <OperationTable
              defaultCols={defaultCols}
              gridData={gridData}
              setGridData={setGridData}
              cols={cols}
              setCols={setCols}
              numRows={numRows}
              setNumRows={setNumRows}
              onVisibleRegionChanged={onVisibleRegionChanged}
              onCellRouteClicked={onCellRouteClicked}
              selection={selection}
              setSelection={setSelection}
              
              
            />
          </SplitterPanel>

          <SplitterPanel size={50} minSize={10}>
            <RouteOperationDetailsTable
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

export default OperationEquipment;
