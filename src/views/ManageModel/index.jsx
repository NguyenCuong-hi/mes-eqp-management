import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// project import
import ModelTable from './table/ModelTable';
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import { onRowAppended } from 'utils/sheets/onRowAppended';
import { message } from 'antd';
import SearchPageAction from 'component/Actions/SearchPageAction';
import { SearchConfigProdBy } from 'services/ModelManage/SearchBy';
import useDynamicFilter from 'utils/hooks/useDynamicFilter';
import { CreateListByService } from 'services/ModelManage/CreateListByService';
import { filterAndSelectColumns } from 'utils/sheets/filterUorA';
import { addTab, setActiveTab } from 'store/tabsReducer';
import { useDispatch } from 'react-redux';
import { setSelectedRow } from '../../store/selectedRowSlice';

// ==============================|| MODEL PRODUCT PAGE ||============================== //

const ManageModelPage = (canCreate) => {
  const { t } = useTranslation();
  const loadingBarRef = useRef(null);
  const controllers = useRef({});
  const dispatch = useDispatch();

  const defaultCols = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: false,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup,
      trailingRowOptions: {
        disabled: false
      }
    },
    {
      title: t('Id'),
      id: 'id',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID
    },
    {
      title: t('Dòng sản phẩm'),
      id: 'configProdName',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID
    },

    {
      title: t('Mô tả'),
      id: 'description',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Chấp nhận'),
      id: 'approval',
      kind: 'Boolean',
      readonly: false,
      width: 150,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Trạng thái'),
      id: 'statusConfProd',
      kind: 'Custom',
      readonly: false,
      width: 150,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model'),
      id: 'modelTypeL',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model'),
      id: 'modelTypeLName',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model M'),
      id: 'modelTypeM',
      kind: 'Custom',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model M'),
      id: 'modelTypeMName',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model S'),
      id: 'modelTypeS',
      kind: 'Custom',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Model S'),
      id: 'modelTypeSName',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Khách hàng'),
      id: 'customer',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Khách hàng'),
      id: 'customerId',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Thiết bị khách hàng'),
      id: 'deviceCustomer',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Nhãn hiệu'),
      id: 'label',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },

    {
      title: t('Quy trình sản xuất'),
      id: 'routeCode',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Quy trình sản xuất'),
      id: 'routeId',
      kind: 'Custom',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Người tạo'),
      id: 'userRegister',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    }
  ]);

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      's_model_prod',
      defaultCols.filter((col) => col.visible)
    )
  );

  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [addedRows, setAddedRows] = useState([]);
  const [numRowsToAdd, setNumRowsToAdd] = useState(null);
  const [editedRows, setEditedRows] = useState([]);

  const [isMinusClicked, setIsMinusClicked] = useState(false)
  const [lastClickedCell, setLastClickedCell] = useState(null)
  const [clickedRowData, setClickedRowData] = useState(null)

  const [isAPISuccess, setIsAPISuccess] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [count, setCount] = useState(0);
  const lastWordEntryRef = useRef(null);
  const [errorData, setErrorData] = useState(null);
  const fieldsToTrack = ['IdxNo'];
  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(gridData, fieldsToTrack);

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsToAdd);
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
  );

  const [openFilter, setOpenFilter] = useState(false);

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const onClickSearch = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
      return;
    }

    if (controllers.current && controllers.current.onClickSearch) {
      controllers.current.onClickSearch.abort();
      controllers.current.onClickSearch = null;
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

    controllers.current.onClickSearch = controller;

    setIsAPISuccess(false);

    try {
      const data = {
        Keyword: keyword,
        PageIndex: pageIndex,
        PageSize: pageSize
      };

      const response = await SearchConfigProdBy(data);
      const fetchedData = response.data || [];

      setGridData(fetchedData);
      setNumRows(fetchedData.length);
    } catch (error) {
      setGridData([]);
      setNumRows(0);
      setIsAPISuccess(true);
    } finally {
      setIsAPISuccess(true);
      controllers.current.onClickSearch = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [keyword, pageIndex, pageSize, isAPISuccess]);

  const onClickFilter = () => {
    setOpenFilter(true);
  };

  const onClickSave = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
      return;
    }

    if (controllers.current && controllers.current.onClickSave) {
      controllers.current.onClickSave.abort();
      controllers.current.onClickSave = null;
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

    controllers.current.onClickSave = controller;

    setIsAPISuccess(false);
    if (canCreate === false) {
      message.warning('Bạn không có quyền thêm dữ liệu');
      return;
    }

    const requiredColumns = ['configProdName', ];

    const columns = [
      'IdxNo',
      'id',
      'configProdName',
      'description',
      'approval',
      'status',
      'statusConfProd',
      'modelTypeL',
      'modelTypeLName',
      'modelTypeM',
      'modelTypeMName',
      'modelTypeS',
      'modelTypeSName',
      'customer',
      'deviceCustomer',
      'label',
      'projectName',
      'dateExpire',
      'routeId',
      'routeCode',
      'userId',
      'userRegister',
      'IDX_NO'
    ];

    const validEntries = filterValidEntries();
    setCount(validEntries.length);
    const lastEntry = findLastEntry(validEntries);

    if (lastWordEntryRef.current?.Id !== lastEntry?.Id) {
      lastWordEntryRef.current = lastEntry;
    }

    const missingIds = findMissingIds(lastEntry);
    if (missingIds.length > 0) {
      message.warning('Vui lòng kiểm tra lại các mục được tạo phải theo đúng thứ tự tuần tự trước khi lưu!');
      return;
    }

    const resulU = filterAndSelectColumns(gridData, columns, 'U').map((row) => ({
      ...row,
      status: 'U',
      id: row.id || '',
   
    }
    )
    );

    const resulA = filterAndSelectColumns(gridData, columns, 'A').map((row) => ({
      ...row,
      status: 'A',
      id: row.id || '',
    }));

    const data = [...resulU, ...resulA];

    if (isSent) return;
    setIsSent(true);

    try {
      const promises = [];

      promises.push(CreateListByService(data));

      const results = await Promise.all(promises);
      const updateGridData = (newData) => {
        setGridData((prevGridData) => {
          const updatedGridData = prevGridData.map((item) => {
            const matchingData = newData.find((data) => data.id === item.id);

            if (matchingData) {
              return {
                ...matchingData,
                id: matchingData.id
              };
            }
            return item;
          });

          return updatedGridData;
        });
      };
      results.forEach((result, index) => {
        if (result.success) {
          if (index === 0) {
            message.success('Thêm thành công!');
          } else {
            message.success('Cập nhật  thành công!');
          }

          setIsSent(false);
          setEditedRows([]);
          // resetTable();
        } else {
          setIsSent(false);
          setErrorData(result);
          message.error('Có lỗi xảy ra khi lưu dữ liệu');
        }
      });
    } catch (error) {
      console.log('error', error);
      setIsSent(false);
      message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      onClickSearch();
    }
  }, [editedRows]);

  useEffect(() => {
    onClickSearch();
  }, []);

  const [lastLoadedRow, setLastLoadedRow] = useState(0);

  const onVisibleRegionChanged = useCallback(
    ({ y, height }) => {
      const lastVisibleRow = y + height;
      if (lastVisibleRow >= numRows && lastVisibleRow > lastLoadedRow) {
        setLastLoadedRow(lastVisibleRow);
        loadMoreData();
      }
    },
    [numRows, lastLoadedRow]
  );

  const loadMoreData = useCallback(() => {
    try {
      const data = {
        Keyword: keyword,
        PageIndex: pageIndex,
        PageSize: pageSize
      };

      const response = SearchConfigProdBy(data);
      const fetchedData = response.data || [];

      setGridData((prev) => [...prev, ...fetchedData]);
      setNumRows((prev) => prev + fetchedData.length);
    } catch (error) {
      message.error(error.message);
    }
  }, [numRows]);

  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex;

      if (cell[0] === -1) {
        rowIndex = cell[1];
        setIsMinusClicked(true);
      } else {
        rowIndex = cell[1];
        setIsMinusClicked(false);
      }

      if (lastClickedCell && lastClickedCell[0] === cell[0] && lastClickedCell[1] === cell[1]) {
        setLastClickedCell(null);
        setClickedRowData(null);
        return;
      }
      if (cell[0] === -1) {
        if (rowIndex >= 0 && rowIndex < gridData.length) {
          const rowData = gridData[rowIndex];
          dispatch(setSelectedRow(rowData));

          dispatch(
            addTab({
              key: 'model-register',
              label: 'Đăng ký cấu hình sản phẩm',
              component: 'ManageModelPageDetails',
              permission: null,
            })
          );

          dispatch(setActiveTab('model-register'));
        }
      }
    },
    [gridData]
  );

  return (
    <>
      <div className="h-full mt-4">
        <SearchPageAction
          titlePage={'Danh sách cấu hình sản phẩm'}
          onSearch={onSearch}
          onClickSearch={onClickSearch}
          onClickFilter={onClickFilter}
          keyword={keyword}
          setKeyword={setKeyword}
          onClickSave={onClickSave}
        />
        <ModelTable
          defaultCols={defaultCols}
          gridData={gridData}
          setGridData={setGridData}
          cols={cols}
          setCols={setCols}
          numRows={numRows}
          setNumRows={setNumRows}
          handleRowAppend={handleRowAppend}
          numRowsToAdd={numRowsToAdd}
          setNumRowsToAdd={setNumRowsToAdd}
          addedRows={addedRows}
          setAddedRows={setAddedRows}
          setEditedRows={setEditedRows}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          onVisibleRegionChanged={onVisibleRegionChanged}
          onCellClicked={onCellClicked}
        />
      </div>
    </>
  );
};

export default ManageModelPage;
