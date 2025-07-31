import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid';
import { DeleteOutlined, EditOutlined, TableOutlined } from '@ant-design/icons';
import { useLayer } from 'react-laag';
// import LayoutMenuSheet from '../../sheet/jsx/layoutMenu'
// import LayoutStatusMenuSheet from '../../sheet/jsx/layoutStatusMenu'
import { Drawer, Checkbox, message, Pagination } from 'antd';

// import ModalHelpRootMenu from '../../modal/system/modalHelpRootMenu'
// import { updateEditedRows } from '../../sheet/js/updateEditedRows'
import { useExtraCells } from '@glideapps/glide-data-grid-cells';
// import { AsyncDropdownCellRenderer } from '../../sheet/cells/AsyncDropdownCellRenderer'
// import LayoutStatusMenuSheetNew from '../../sheet/jsx/layoutStatusMenuNew'
import dayjs from 'dayjs';
import useOnFill from 'utils/hooks/onFillHook';
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import ContextMenuWrapper from 'component/ContextMenu';
import { resetColumn } from 'utils/local-storage/reset-column';
import { DropdownRenderer } from 'utils/sheets/cell-custom/DropDownCells';
import { updateEditedRows } from 'utils/sheets/updateEditedRows';
import { CellsOperation } from 'utils/sheets/cell-custom/cellsOperation';
import { reorderColumns } from 'utils/sheets/reorderColumns';
import { useNotify } from 'utils/hooks/onNotify';
import { SearchOperationBy } from 'services/RouteSetManage/SearchOperationBy';

function RouteSetOpIndicateTable({
  setSelection,
  selection,
  setShowSearch,
  onCellClicked,
  showSearch,
  setEditedRows,
  setOnSelectRow,
  setOpenHelp,
  openHelp,
  setGridData,
  gridData,
  handleRestSheet,
  numRows,
  handleRowAppend,
  setCols,
  cols,
  defaultCols,
  canEdit,
  cellConfig,
  controllers,
  loadingBarRef,
  setIsAPISuccess,
  isAPISuccess
}) {
  const gridRef = useRef(null);
  const [open, setOpen] = useState(false);
  const cellProps = useExtraCells();
  const onFill = useOnFill(setGridData, cols);
  const onSearchClose = useCallback(() => setShowSearch(false), []);
  const [showMenu, setShowMenu] = useState(null);
  const [isCell, setIsCell] = useState(null);
  const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '');
  const { notify, contextHolder } = useNotify();
  

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    return loadFromLocalStorageSheet('H_ROUTE_OPERATION_REWORK', []);
  });
  const [keyword, setKeyword] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeSearch, setTypeSearch] = useState('');
  const [keySearchText, setKeySearchText] = useState('');
  const [hoverRow, setHoverRow] = useState(undefined);
  const [dataOperation, setDataOperation] = useState([]);

  const onItemHovered = useCallback((args) => {
    const [_, row] = args.location;
    setHoverRow(args.kind !== 'cell' ? undefined : row);
  }, []);

  const onHeaderMenuClick = useCallback((col, bounds) => {
    if (cols[col]?.id === 'Status') {
      setShowMenu({
        col,
        bounds,
        menuType: 'statusMenu'
      });
    } else {
      setShowMenu({
        col,
        bounds,
        menuType: 'defaultMenu'
      });
    }
  }, []);

  const columnNames = [
      'operationName',
    ]
    const highlightRegions = columnNames.map((columnName) => ({
      color: '#e8f0ff',
      range: {
        x: reorderColumns(cols).indexOf(columnName),
        y: 0,
        width: 1,
        height: numRows,
      },
    }))
  

  const [keybindings, setKeybindings] = useState({
    downFill: true,
    rightFill: true,
    selectColumn: false
  });

    const onFetchCellData = useCallback(async () => {
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
        return;
      }
  
      if (controllers.current && controllers.current.onFetchCellData) {
        controllers.current.onFetchCellData.abort();
        controllers.current.onFetchCellData = null;
        if (loadingBarRef.current) {
          loadingBarRef.current.continuousStart();
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      if (loadingBarRef.current) {
        loadingBarRef.current.continuousStart();
      }
      const controller = new AbortController();
      const signal = controller.signal;
  
      controllers.current.onFetchCellData = controller;
  
      setIsAPISuccess(false);
  
      try {
        const promises = [];
  
        const searchParam = {
          Keyword: keyword,
          PageIndex: pageIndex,
          PageSize: pageSize
        };
        const [dataOperation, ] = await Promise.all([SearchOperationBy(searchParam, signal), ]);
        setDataOperation(dataOperation.data);
      } catch (error) {
        setIsAPISuccess(true);
        notify({
          type: 'error',
          message: 'Lỗi',
          description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
        });
      } finally {
        setIsAPISuccess(true);
        controllers.current.onFetchRoute = null;
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    }, []);
  
    useEffect(() => {
      onFetchCellData();
    }, []);
  

  const getData = useCallback(
    ([col, row]) => {
      const person = gridData[row] || {};
      const column = cols[col];
      const columnKey = column?.id || '';
      const value = person[columnKey] || '';
      const boundingBox = document.body.getBoundingClientRect();
      const cellConfig = {
        operationName: {
          kind: 'cells-operation',
          allowedValues: dataOperation,
          setCacheData: setDataOperation
        },
        
      };

      if (cellConfig[columnKey]) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: String(value),
          data: {
            kind: cellConfig[columnKey].kind,
            allowedValues: cellConfig[columnKey].allowedValues,
            value: value,
            boundingBox: boundingBox,
            setCacheData: setDataOperation
          },
          displayData: String(value),
          readonly: column?.readonly || false,
          hasMenu: column?.hasMenu || false
        };
      }

      if (columnKey === 'isUse') {
        const booleanValue = value === 1 || value === '1' ? true : value === 0 || value === '0' ? false : Boolean(value);
        return {
          kind: GridCellKind.Boolean,
          data: booleanValue,
          allowOverlay: true,
          hasMenu: column?.hasMenu || false
        };
      }

      if (
        columnKey === 'queueNumber' ||
        columnKey === 'processNumber' ||
        columnKey === 'yield' 
      ) {
        return {
          kind: GridCellKind.Number,
          data: value,
          displayData: new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
          }).format(value),
          readonly: column?.readonly || false,
          contentAlign: 'right',
          allowOverlay: true,
          hasMenu: column?.hasMenu || false,
        }
      }

      return {
        kind: GridCellKind.Text,
        data: value,
        copyData: String(value),
        displayData: String(value),
        readonly: column?.readonly || false,
        allowOverlay: true,
        hasMenu: column?.hasMenu || false
      };
    },
    [gridData, cols, dataOperation]
  );

  const onKeyUp = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        console.log('Enter pressed');
      }
    },
    [cols, gridData]
  );

  const onColumnResize = useCallback(
    (column, newSize) => {
      const index = cols.indexOf(column);
      if (index !== -1) {
        const newCol = {
          ...column,
          width: newSize
        };
        const newCols = [...cols];
        newCols.splice(index, 1, newCol);
        setCols(newCols);
      }
    },
    [cols]
  );

  const { renderLayer, layerProps } = useLayer({
    isOpen: showMenu !== null,
    triggerOffset: 4,
    onOutsideClick: () => setShowMenu(null),
    trigger: {
      getBounds: () => ({
        bottom: (showMenu?.bounds.y ?? 0) + (showMenu?.bounds.height ?? 0),
        height: showMenu?.bounds.height ?? 0,
        left: showMenu?.bounds.x ?? 0,
        right: (showMenu?.bounds.x ?? 0) + (showMenu?.bounds.width ?? 0),
        top: showMenu?.bounds.y ?? 0,
        width: showMenu?.bounds.width ?? 0
      })
    },
    placement: 'bottom-start',
    auto: true,
    possiblePlacements: ['bottom-start', 'bottom-end']
  });

  /* TOOLLS */
  const handleSort = (columnId, direction) => {
    setGridData((prevData) => {
      const rowsWithStatusA = prevData.filter((row) => row.Status === 'A');
      const rowsWithoutStatusA = prevData.filter((row) => row.Status !== 'A');

      const sortedData = rowsWithoutStatusA.sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'asc' ? -1 : 1;
        if (a[columnId] > b[columnId]) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      return [...sortedData, ...rowsWithStatusA];
    });
    setShowMenu(null);
  };
  const updateHiddenColumns = (newHiddenColumns) => {
    setHiddenColumns((prevHidden) => {
      const newHidden = [...new Set([...prevHidden, ...newHiddenColumns])];
      saveToLocalStorageSheet('H_ROUTE_OPERATION_REWORK', newHidden);
      return newHidden;
    });
  };

  const updateVisibleColumns = (newVisibleColumns) => {
    setCols((prevCols) => {
      const newCols = [...new Set([...prevCols, ...newVisibleColumns])];
      const uniqueCols = newCols.filter((col, index, self) => index === self.findIndex((c) => c.id === col.id));
      saveToLocalStorageSheet('S_ROUTE_OPERATION_REWORK', uniqueCols);
      return uniqueCols;
    });
  };
  // Hàm ẩn cột
  const handleHideColumn = (colIndex) => {
    const columnId = cols[colIndex]?.id;
    if (cols.length > 1) {
      updateHiddenColumns([columnId]);
      setCols((prevCols) => {
        const newCols = prevCols.filter((_, idx) => idx !== colIndex);
        const uniqueCols = newCols.filter((col, index, self) => index === self.findIndex((c) => c.id === col.id));
        saveToLocalStorageSheet('S_ROUTE_OPERATION_REWORK', uniqueCols);
        return uniqueCols;
      });
      setShowMenu(null);
    }
  };
  // Hàm rEST LẤY LẠI CỘT DỮ LIỆU

  const handleReset = () => {
    setCols(defaultCols.filter((col) => col.visible));
    setHiddenColumns([]);
    localStorage.removeItem('S_ROUTE_OPERATION_REWORK');
    localStorage.removeItem('H_ROUTE_OPERATION_REWORK');
    setShowMenu(null);
  };

  const onColumnMoved = useCallback((startIndex, endIndex) => {
    setCols((prevCols) => {
      const updatedCols = [...prevCols];
      const [movedColumn] = updatedCols.splice(startIndex, 1);
      updatedCols.splice(endIndex, 0, movedColumn);
      saveToLocalStorageSheet('S_ROUTE_OPERATION_REWORK', updatedCols);
      return updatedCols;
    });
  }, []);

  const showDrawer = () => {
    const invisibleCols = defaultCols.filter((col) => col.visible === false).map((col) => col.id);
    const currentVisibleCols = loadFromLocalStorageSheet('S_ROUTE_OPERATION_REWORK', []).map((col) => col.id);
    const newInvisibleCols = invisibleCols.filter((col) => !currentVisibleCols.includes(col));
    updateHiddenColumns(newInvisibleCols);
    updateVisibleColumns(defaultCols.filter((col) => col.visible && !hiddenColumns.includes(col.id)));
    setOpen(true);
    setShowMenu(null);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (columnId, isChecked) => {
    ``;
    if (isChecked) {
      const restoredColumn = defaultCols.find((col) => col.id === columnId);
      setCols((prevCols) => {
        const newCols = [...prevCols, restoredColumn];
        saveToLocalStorageSheet('S_ROUTE_OPERATION_REWORK', newCols);
        return newCols;
      });
      setHiddenColumns((prevHidden) => {
        const newHidden = prevHidden.filter((id) => id !== columnId);
        saveToLocalStorageSheet('H_ROUTE_OPERATION_REWORK', newHidden);
        return newHidden;
      });
    } else {
      setCols((prevCols) => {
        const newCols = prevCols.filter((col) => col.id !== columnId);
        saveToLocalStorageSheet('S_ROUTE_OPERATION_REWORK', newCols);
        return newCols;
      });
      setHiddenColumns((prevHidden) => {
        const newHidden = [...prevHidden, columnId];
        saveToLocalStorageSheet('H_ROUTE_OPERATION_REWORK', newHidden);
        return newHidden;
      });
    }
  };
  const handleMenuClick = ({ key }) => {
    if (key === 'edit') message.info('Chỉnh sửa');
    if (key === 'delete') message.warning('Xoá');
  };

  const onCellEdited = useCallback(
    async (cell, newValue) => {
      if (canEdit === false) {
        message.warning('Bạn không có quyền chỉnh sửa dữ liệu');
        return;
      }

      if (
        newValue.kind !== GridCellKind.Text &&
        newValue.kind !== GridCellKind.Custom &&
        newValue.kind !== GridCellKind.Boolean &&
        newValue.kind !== GridCellKind.Number
      ) {
        return;
      }

      const indexes = resetColumn(cols);
      const [col, row] = cell;
      const key = indexes[col];

      if (key === 'operationName') {
        if (newValue.kind === GridCellKind.Custom) {
          setGridData((prev) => {
            const newData = [...prev];
            const product = newData[row];

            let selectedName = newValue.data;
            const checkCopyData = newValue.copyData;
            if (selectedName) {
              const selectedValue = dataOperation.find((item) => item.id === selectedName[0].id);
              product['operationId'] = selectedValue.id;
              product['operationCode'] = selectedValue.operationCode;
              product['operationName'] = selectedValue.operationName;
            } else {
              product['operationId'] = '';
              product['operationCode'] = '';
              product['operationName'] = '';
            }

            product.isEdited = true;
            product['IdxNo'] = row + 1;
            const currentStatus = product['Status'] || 'U';
            product['Status'] = currentStatus === 'A' ? 'A' : 'U';

            setEditedRows((prevEditedRows) => updateEditedRows(prevEditedRows, row, newData, currentStatus));

            return newData;
          });
          return;
        }
      }

      setGridData((prevData) => {
        const updatedData = [...prevData];
        if (!updatedData[row]) updatedData[row] = {};

        const currentStatus = updatedData[row]['Status'] || '';
        updatedData[row][key] = newValue.data;
        updatedData[row]['Status'] = currentStatus === 'A' ? 'A' : 'U';

        setEditedRows((prevEditedRows) => {
          const existingIndex = prevEditedRows.findIndex((editedRow) => editedRow.rowIndex === row);

          const updatedRowData = {
            rowIndex: row,
            updatedRow: updatedData[row],
            status: currentStatus === 'A' ? 'A' : 'U'
          };

          if (existingIndex === -1) {
            return [...prevEditedRows, updatedRowData];
          } else {
            const updatedEditedRows = [...prevEditedRows];
            updatedEditedRows[existingIndex] = updatedRowData;
            return updatedEditedRows;
          }
        });

        return updatedData;
      });
    },
    [canEdit, cols, gridData, dataOperation, setEditedRows, setGridData]
  );

  return (
    <div className="bg-slate-50  h-[calc(100vh-189px)]">
      <div className="w-full h-full gap-1 flex items-center justify-center ">
        <div className="w-full h-full flex flex-col border bg-white overflow-auto ">
          <ContextMenuWrapper
            menuItems={[
              { key: 'edit', label: 'Chỉnh sửa', icon: <EditOutlined /> },
              { key: 'delete', label: 'Xoá', icon: <DeleteOutlined /> }
            ]}
            onMenuClick={handleMenuClick}
          >
            <DataEditor
              {...cellProps}
              ref={gridRef}
              columns={cols}
              getCellContent={getData}
              onFill={onFill}
              rows={numRows}
              showSearch={showSearch}
              onSearchClose={onSearchClose}
              rowMarkers="both"
              width="100%"
              height="100%"
              headerHeight={32}
              rowHeight={27}
              rowSelect="multi"
              gridSelection={selection}
              onGridSelectionChange={setSelection}
              getCellsForSelection={true}
              trailingRowOptions={{
                hint: ' ',
                sticky: true,
                tint: true
              }}
              freezeColumns={1}
              getRowThemeOverride={(i) =>
                i === hoverRow
                  ? {
                      bgCell: '#f7f7f7',
                      bgCellMedium: '#f0f0f0'
                    }
                  : i % 2 === 0
                    ? undefined
                    : {
                        bgCell: '#FBFBFB'
                      }
              }
              overscrollY={0}
              overscrollX={0}
              smoothScrollY={true}
              smoothScrollX={true}
              onPaste={true}
              fillHandle={true}
              keybindings={keybindings}
              onRowAppended={() => handleRowAppend(1)}
              onCellEdited={onCellEdited}
              onCellClicked={onCellClicked}
              onColumnResize={onColumnResize}
              customRenderers={[DropdownRenderer, CellsOperation]}
              highlightRegions={highlightRegions}
              // onHeaderMenuClick={onHeaderMenuClick}
              // onColumnMoved={onColumnMoved}
              // onKeyUp={onKeyUp}
              // customRenderers={[
              //     AsyncDropdownCellRenderer
              // ]}
              // onItemHovered={onItemHovered}
            />
            {/* {showMenu !== null &&
                    renderLayer(
                        <div
                            {...layerProps}
                            className="border  w-72 rounded-lg bg-white shadow-lg cursor-pointer"
                        >
                            {showMenu.menuType === 'statusMenu' ? (
                                <LayoutStatusMenuSheetNew
                                showMenu={showMenu}
                                data={formattedData}
                                handleSort={handleSort}
                                cols={cols}
                                renderLayer={renderLayer}
                                setShowSearch={setShowSearch}
                                setShowMenu={setShowMenu}
                                layerProps={layerProps}
                                handleReset={handleReset}
                                showDrawer={showDrawer}
                                fileName="PDQCOSPResultList"
                                customHeaders={cols}
                              />
                            ) : (
                                <LayoutMenuSheet
                                    showMenu={showMenu}
                                    handleSort={handleSort}
                                    handleHideColumn={handleHideColumn}
                                    cols={cols}
                                    renderLayer={renderLayer}
                                    setShowSearch={setShowSearch}
                                    setShowMenu={setShowMenu}
                                    layerProps={layerProps}
                                />
                            )}
                        </div>,
                    )} */}
          </ContextMenuWrapper>

          <Drawer title="CÀI ĐẶT SHEET" onClose={onClose} open={open}>
            {defaultCols.map(
              (col) =>
                col.id !== 'Status' && (
                  <div key={col.id} style={{ marginBottom: '10px' }}>
                    <Checkbox checked={!hiddenColumns.includes(col.id)} onChange={(e) => handleCheckboxChange(col.id, e.target.checked)}>
                      {col.title}
                    </Checkbox>
                  </div>
                )
            )}
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default RouteSetOpIndicateTable;
