import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
// project import
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import ModelInfomationQuery from './query/ModelInfomationQuery';
import ModelRouteSet from './query/ModelRouteSet';
import ModelGroupCategory from './query/ModelGroupCategory';
import AuDrAction from 'component/Actions/AuDrAction';
import { onRowAppended } from 'utils/sheets/onRowAppended';
import { Button, Form, Menu, message, Spin } from 'antd';
import {
  ApartmentOutlined,
  AppstoreAddOutlined,
  CaretDownFilled,
  CaretUpFilled,
  DownCircleFilled,
  MinusCircleFilled,
  MinusOutlined,
  MonitorOutlined,
  PlusCircleFilled,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useFullscreenLoading } from 'utils/hooks/useFullscreenLoading';
import { useNotify } from 'utils/hooks/onNotify';
import { useSelector } from 'react-redux';
import useDynamicFilter from 'utils/hooks/useDynamicFilter';
import { getConfigProdById } from 'services/ModelManage/GetConfigProdById';
import { SearchRouteBy } from 'services/ModelManage/SearchRouteBy';
import { filterAndSelectColumns } from 'utils/sheets/filterUorA';

import { DeleteConfigRouteBy } from 'services/ModelManage/DeleteConfigRouteBy';
import { DeleteCategoryBy } from 'services/ModelManage/DeleteCategoryBy';
import { CreateConfigRouteByService } from 'services/ModelManage/CreateConfigRouteByService';
import { DeleteConfigProd } from 'services/ModelManage/DeleteConfigProd';
import { UpdateConfigProdBy } from 'services/ModelManage/UpdateConfigProdBy';

// ==============================|| MODEL PRODUCT PAGE ||============================== //

const ManageModelPageDetails = ({ canCreate, canEdit, canDelete, canView }) => {
  const { t } = useTranslation();
  const { notify, contextHolder } = useNotify();
  const { spinning, percent, showLoader, hideLoader } = useFullscreenLoading();
  const controllers = useRef({});
  const selectedData = useSelector((state) => state.selectedRow);
  const [isAPISuccess, setIsAPISuccess] = useState(true);
  const loadingBarRef = useRef(null);
  const [lastLoadedRow, setLastLoadedRow] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isMinusClicked, setIsMinusClicked] = useState(false);
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [clickedRowData, setClickedRowData] = useState(null);

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const [selectionCategory, setSelectionCategory] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const [selectionRoute, setSelectionRoute] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const [routeSelected, setRouteSelected] = useState([]);
  const [addedRows, setAddedRows] = useState([]);
  const [numRowsToAdd, setNumRowsToAdd] = useState(null);
  const [editedRows, setEditedRows] = useState([]);
  const [editedRowsCategory, setEditedRowsCategory] = useState([]);

  const [categorySelected, setCategorySelected] = useState([]);
  const [routeDetailSelected, setRouteDetailSelected] = useState([]);

  const defaultCols = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup,
      trailingRowOptions: {
        disabled: false
      }
    },
    {
      title: t('Mã dây chuyền'),
      id: 'id',
      kind: 'Text',
      readonly: true,
      width: 10,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Mã dây chuyền'),
      id: 'routeCode',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên dây chuyền'),
      id: 'routeName',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Mô tả'),
      id: 'description',
      kind: 'Text',
      readonly: true,
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
      'S_DETAIL_MODEL',
      defaultCols.filter((col) => col.visible)
    )
  );

  const defaultColsRoute = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup,
      trailingRowOptions: {
        disabled: false
      }
    },
    {
      title: t('Mã dây chuyền'),
      id: 'routeId',
      kind: 'Text',
      readonly: true,
      width: 10,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Mã dây chuyền'),
      id: 'routeCode',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên dây chuyền'),
      id: 'routeName',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Mô tả'),
      id: 'description',
      kind: 'Text',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    }
  ]);

  const [colsRoute, setColsRoute] = useState(() =>
    loadFromLocalStorageSheet(
      'S_DETAIL_MODEL_ROUTE',
      defaultColsRoute.filter((col) => col.visible)
    )
  );
  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);

  const [gridDataRoute, setGridDataRoute] = useState([]);
  const [numRowsRoute, setNumRowsRoute] = useState(0);

  const defaultColsCategory = useMemo(() => [
    {
      title: '',
      id: 'Status',
      kind: 'Text',
      readonly: true,
      width: 50,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderLookup,
      trailingRowOptions: {
        disabled: false
      }
    },
    {
      title: t('Mã thuộc tính'),
      id: 'id',
      kind: 'Text',
      readonly: true,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên thuộc tính'),
      id: 'promptName',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },

    {
      title: t('Mô tả'),
      id: 'description',
      kind: 'Text',
      readonly: false,
      width: 500,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Bắt buộc nhập'),
      id: 'mustInput',
      kind: 'Boolean',
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
      title: t('ID giá trị thuộc tính'),
      id: 'promptValueId',
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
      title: t('Giá trị thuộc tính'),
      id: 'promptValueName',
      kind: 'Custom',
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

  const [colsCategory, setColsCategory] = useState(() =>
    loadFromLocalStorageSheet(
      'S_DETAIL_CATEGORY',
      defaultColsCategory.filter((col) => col.visible)
    )
  );
  const [gridDataCategory, setGridDataCategory] = useState([]);
  const [numRowsCategory, setNumRowsCategory] = useState(0);
  const [numRowsToAddCategory, setNumRowsToAddCategory] = useState(null);
  const [addedRowsCategory, setAddedRowsCategory] = useState([]);

  const [isSent, setIsSent] = useState(false);
  const [count, setCount] = useState(0);
  const lastWordEntryRef = useRef(null);
  const fieldsToTrack = ['IdxNo'];
  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(gridData, fieldsToTrack);

  //  Data Input
  const [formModelBasic] = Form.useForm();

  // Data
  const dataL = [
    { label: 'L-1', value: 1 },
    { label: 'L-2', value: 2 },
    { label: 'L-3', value: 3 }
  ];
  const dataM = [
    { label: 'M-1', value: 1 },
    { label: 'M-2', value: 2 },
    { label: 'M-3', value: 3 }
  ];
  const dataS = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 }
  ];

  const dataCustomer = [
    { label: 'SAMSUNG', value: 1 },
    { label: 'MISUKI', value: 2 },
    { label: 'APPLE', value: 3 }
  ];

  const dataStatus = [
    { label: 'Đang áp dụng', value: 1 },
    { label: 'Chưa áp dụng', value: 2 },
    { label: 'Thử nghiệm', value: 3 }
  ];

  const dataCategoryValue = [
    { MinorName: '8080', Value: 1 },
    { MinorName: '8000', Value: 2 },
    { MinorName: '3000', Value: 3 }
  ];

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      DatePeriod: values.DatePeriod?.format('YYYY-MM-DD') || null
    };

    console.log('Giá trị sau khi format:', formattedValues);
  };

  const [checkPageA, setCheckPageA] = useState(false);
  const [current, setCurrent] = useState('1');

  const onClickSave = useCallback(async () => {
    const requiredColumns = ['configProdName'];

    const columnsRoute = ['IdxNo', 'id', 'routeId', 'routeCode', 'routeName', 'description', 'status', 'IDX_NO'];

    const columnsCategory = [
      'IdxNo',
      'id',
      'configProdNameId',
      'routeId',
      'eventId',
      'operationId',
      'promptId',
      'promptName',
      'description',
      'mustInput',
      'promptValueId',
      'promptValueName',
      'promptType',
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

    const resulU = filterAndSelectColumns(gridDataRoute, columnsRoute, 'U').map((row) => ({
      ...row,
      Status: 'U',
      id: row.id || ''
    }));

    const resulA = filterAndSelectColumns(gridDataRoute, columnsRoute, 'A').map((row) => ({
      ...row,
      Status: 'A',
      id: row.id || ''
    }));

    const dataRoute = [...resulU, ...resulA];

    if (isSent) return;
    setIsSent(true);

    try {
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
      const data = await formModelBasic.getFieldValue();

      const dataCategoryA = filterAndSelectColumns(gridDataCategory, columnsCategory, 'A').map((row) => ({
        ...row,
        Status: 'A',
        id: row.id || '',
        configProdNameId: data.id || ''
      }));

      const dataCategoryU = filterAndSelectColumns(gridDataCategory, columnsCategory, 'U').map((row) => ({
        ...row,
        Status: 'U',
        id: row.id || '',
        configProdNameId: data.id || ''
      }));

      const dataCategory = [...dataCategoryA, ...dataCategoryU];
      const dto = {
        ...data,
        routes: dataRoute,
        promptCategories: dataCategory
      };
      try {
        const result = await UpdateConfigProdBy(data.id, dto);

        if (result.success) {
          notify({
            type: 'success',
            message: 'Thành công',
            description: 'Cập nhật thành công!'
          });

          setIsSent(false);
          setEditedRows([]);
          resetTable();
        } else {
          setIsSent(false);
          notify({
            type: 'error',
            message: 'Lỗi',
            description: 'Không thể lưu dữ liệu. Vui lòng thử lại sau.'
          });
        }
      } catch (error) {
        console.log('error', error);
        setIsSent(false);
        message.error(error.message || 'Có lỗi xảy ra khi lưu dữ liệu');
      } finally {
        onClickSearch();
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }, [formModelBasic, gridDataCategory, gridDataRoute, isAPISuccess]);

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
      const response = await getConfigProdById(selectedData.data.id);
      const fetchedData = response.data || [];

      formModelBasic.setFieldsValue({
        id: fetchedData.id,
        statusConfProd: fetchedData.statusConfProd,
        configProdName: fetchedData.configProdName,
        description: fetchedData.description,
        approval: fetchedData.approval,
        status: fetchedData.status,
        dateExpire: fetchedData.dateExpire ? dayjs(selectedData.data.datePeriod) : null,
        customer: fetchedData.customer,
        userRegister: fetchedData.userRegister,
        modelTypeLName: fetchedData.modelTypeLName,
        modelTypeL: fetchedData.modelTypeL,
        modelTypeM: fetchedData.modelTypeM,
        modelTypeMName: fetchedData.modelTypeMName,
        modelTypeS: fetchedData.modelTypeS,
        modelTypeSName: fetchedData.modelTypeSName,
        deviceCustomer: fetchedData.deviceCustomer,
        consignee: fetchedData.consignee,
        label: fetchedData.label,
        projectName: fetchedData.projectName
      });

      setGridDataCategory(fetchedData.promptCategories || []);
      setNumRowsCategory(fetchedData.promptCategories?.length || 0);

      setGridDataRoute(fetchedData.routes || []);
      setNumRowsRoute(fetchedData.routes?.length || 0);
    } catch (error) {
      setGridDataCategory([]);
      setNumRowsCategory(0);
      setGridDataRoute([]);
      setNumRowsRoute(0);
      setIsAPISuccess(true);
    } finally {
      setIsAPISuccess(true);
      controllers.current.onClickSearch = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [isAPISuccess, selectedData, formModelBasic]);

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

      const response = SearchRouteBy(data);
      const fetchedData = response.data || [];

      setGridData((prev) => [...prev, ...fetchedData]);
      setNumRows((prev) => prev + fetchedData.length);
    } catch (error) {
      message.error(error.message);
    }
  }, [numRows]);

  const onFetchRoute = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
      return;
    }

    if (controllers.current && controllers.current.onFetchRoute) {
      controllers.current.onFetchRoute.abort();
      controllers.current.onFetchRoute = null;
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

    controllers.current.onFetchRoute = controller;

    setIsAPISuccess(false);

    try {
      const data = {
        Keyword: keyword,
        PageIndex: pageIndex,
        PageSize: pageSize
      };

      const response = await SearchRouteBy(data);
      const fetchedData = response.data || [];

      setGridData(fetchedData);
      setNumRows(fetchedData.length);
    } catch (error) {
      setGridData([]);
      setNumRows(0);
      setIsAPISuccess(true);
      notify({
        type: 'false',
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
  }, [keyword, pageIndex, pageSize, isAPISuccess]);

  const getSelectedRowsData = () => {
    const selectedRows = selection.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridData[start + i]).filter((row) => row !== undefined)
    );
  };

  const getSelectedRowsCategoryData = () => {
    const selectedRows = selectionCategory.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridDataCategory[start + i]).filter((row) => row !== undefined)
    );
  };

  const getSelectedRowsRouteDetailsData = () => {
    const selectedRows = selectionRoute.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridDataRoute[start + i]).filter((row) => row !== undefined)
    );
  };

  const onCellRouteClicked = useCallback(
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
          const isSelected = selection.rows.hasIndex(rowIndex);

          let newSelected;
          if (isSelected) {
            newSelected = selection.rows.remove(rowIndex);
            setRouteSelected(getSelectedRowsData());
          } else {
            newSelected = selection.rows.add(rowIndex);
            setRouteSelected([]);
          }
        }
      }
    },
    [gridData, getSelectedRowsData, routeSelected]
  );

  const onCellRouteDetailsClicked = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataRoute.length) {
          const isSelected = selectionRoute.rows.hasIndex(rowIndex);

          let newSelected;
          if (isSelected) {
            newSelected = selectionRoute.rows.remove(rowIndex);
            setRouteDetailSelected(getSelectedRowsRouteDetailsData());
          } else {
            newSelected = selectionRoute.rows.add(rowIndex);
            setRouteDetailSelected([]);
          }
        }
      }
    },
    [gridDataRoute, getSelectedRowsRouteDetailsData, routeDetailSelected]
  );

  const onCellCategoryClicked = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataCategory.length) {
          const isSelected = selectionCategory.rows.hasIndex(rowIndex);

          let newSelected;
          if (isSelected) {
            newSelected = selectionCategory.rows.remove(rowIndex);
            setCategorySelected(getSelectedRowsCategoryData());
          } else {
            newSelected = selectionCategory.rows.add(rowIndex);
            setCategorySelected([]);
          }
        }
      }
    },
    [gridDataCategory, getSelectedRowsCategoryData, categorySelected]
  );

  useEffect(() => {
    onClickSearch();
    onFetchRoute();
  }, [selectedData]);

  const onInsertRow = useCallback(async () => {
    if (!Array.isArray(routeSelected) || routeSelected.length === 0) {
      console.warn('routeSelected is empty or invalid');
      return;
    }

    try {
      const dto = routeSelected.map((item) => ({
        routeId: item.id,
        routeCode: item.routeCode,
        routeName: item.routeName,
        description: item.description,
        status: item.status || 'A',
        IdxNo: item.IdxNo || 0,
        configProdNameId: selectedData.data.id || '',
        configProdName: selectedData.data.configProdName || ''
      }));

      const result = await CreateConfigRouteByService(dto);

      if (result.success) {
        notify({
          type: 'success',
          message: 'Thành công',
          description: 'Cập nhật thành công!'
        });
      } else {
        notify({
          type: 'success',
          message: 'Thành công',
          description: 'Cập nhật thành công!'
        });
      }
    } catch (error) {
      console.error('Error in onInsertRow:', error);
      message.error('Có lỗi xảy ra khi thêm dòng mới');
      return;
    }

    setGridDataRoute((prevGridData) => {
      const updatedGridData = [...prevGridData];

      let addedCount = 0;

      routeSelected.forEach((newItem) => {
        const existingIndex = updatedGridData.findIndex((item) => item.id === newItem.routeId || item.routeCode === newItem.routeCode);

        if (existingIndex !== -1) {
          updatedGridData[existingIndex] = {
            ...updatedGridData[existingIndex],
            ...newItem
          };
        } else {
          updatedGridData.push({
            ...newItem,
            IdxNo: updatedGridData.length + 1
          });
          addedCount++;
        }
      });

      setNumRowsRoute((prevNumRows) => prevNumRows + addedCount);

      return updatedGridData;
    });
  }, [routeSelected]);

  const removeRow = useCallback(
    async (rowIndex) => {
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
        return;
      }

      if (controllers.current && controllers.current.removeRow) {
        controllers.current.removeRow.abort();
        controllers.current.removeRow = null;
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

      controllers.current.removeRow = controller;

      setIsAPISuccess(false);

      try {
        if (routeDetailSelected.length === 0 && categorySelected.length === 0) {
          message.warning('Vui lòng chọn ít nhất một dòng để xóa');
          return;
        }
        let response;
        if (routeDetailSelected.length > 0) {
          const idConfigRoute = routeDetailSelected.map((item) => item.id).filter((id) => id !== undefined);
          response = await DeleteConfigRouteBy(idConfigRoute);
          setGridDataRoute((prevGridData) => {
            const updatedGridData = [...prevGridData];
            updatedGridData.splice(rowIndex, 1);
            setNumRowsRoute((prevNumRows) => prevNumRows - 1);
            return updatedGridData;
          });
        }
        if (categorySelected.length > 0) {
          const idCategory = categorySelected.map((item) => item.id).filter((id) => id !== undefined);
          response = await DeleteCategoryBy(idCategory);
          setGridDataCategory((prevGridData) => {
            const updatedGridData = [...prevGridData];
            updatedGridData.splice(rowIndex, 1);
            setNumRowsCategory((prevNumRows) => prevNumRows - 1);
            return updatedGridData;
          });
        }
        const fetchedData = response || [];

        if (!fetchedData.success) {
          notify({
            type: 'error',
            message: 'Lỗi',
            description: 'Không thể xóa dữ liệu. Vui lòng thử lại sau.'
          });
          return;
        } else {
          notify({
            type: 'success',
            message: 'Thành công',
            description: 'Xóa dữ liệu thành công!'
          });
        }
        setIsAPISuccess(true);
        controllers.current.onClickSearch = null;
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      } catch (error) {
        console.log('error', error);
        setIsAPISuccess(true);
        notify({
          type: 'error',
          message: 'Lỗi',
          description: error.message || 'Vui lòng thử lại sau.'
        });
      } finally {
        setIsAPISuccess(true);
        controllers.current.removeRow = null;
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    },
    [gridDataRoute, gridDataCategory, categorySelected, routeDetailSelected]
  );

  const handleRowAppendCategory = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsCategory, setGridDataCategory, setNumRowsCategory, setAddedRowsCategory, numRowsToAdd);
    },
    [colsCategory, setGridDataCategory, setNumRowsCategory, setAddedRowsCategory, numRowsToAddCategory]
  );

  const onClickDelete = useCallback(async () => {
    if (!selectedData || !selectedData.data || !selectedData.data.id) {
      message.warning('Vui lòng chọn dữ liệu để xóa');
      return;
    }

    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
      return;
    }

    if (controllers.current && controllers.current.onClickDelete) {
      controllers.current.onClickDelete.abort();
      controllers.current.onClickDelete = null;
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

    controllers.current.onClickDelete = controller;

    setIsAPISuccess(false);

    try {
      let response = await DeleteConfigProd(selectedData.data.id);

      if (!response.success) {
        notify({
          type: 'error',
          message: 'Lỗi',
          description: response.data.message || 'Không thể xóa dữ liệu. Vui lòng thử lại sau.'
        });
        return;
      } else {
        setGridDataCategory([]);
        setNumRowsCategory(0);
        setGridDataRoute([]);
        setNumRowsRoute(0);
        formModelBasic.resetFields();

        notify({
          type: 'success',
          message: 'Thành công',
          description: 'Xóa dữ liệu thành công!'
        });
      }
      setIsAPISuccess(true);
      controllers.current.onClickDelete = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    } catch (error) {
      setIsAPISuccess(true);
      notify({
        type: 'error',
        message: 'Lỗi',
        description: error.message || 'Vui lòng thử lại sau.'
      });
    } finally {
      setIsAPISuccess(true);
      controllers.current.onClickDelete = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [selectedData, gridDataRoute, gridDataCategory, formModelBasic, isAPISuccess]);

  return (
    <>
      <div className="h-full pt-4">
        <AuDrAction
          titlePage={'Đăng ký chi tiết cấu hình sản phẩm'}
          onClickDelete={onClickDelete}
          onClickSave={onClickSave}
          onClickUpdate={() => {}}
          onClickReset={() => {}}
        />
        <ModelInfomationQuery
          formModelBasic={formModelBasic}
          dataL={dataL}
          dataM={dataM}
          dataS={dataS}
          dataCustomer={dataCustomer}
          dataStatus={dataStatus}
          onFinish={onFinish}
        />

        <Menu
          mode="horizontal"
          selectedKeys={[current]}
          style={{
            height: 30,
            lineHeight: '30px',
            paddingTop: 2,
            paddingBottom: 0,
            minHeight: 0
          }}
          onClick={(e) => {
            if (!checkPageA) {
              setCurrent(e.key);
            } else {
              message.warning(t('870000042'));
            }
          }}
        >
          <Menu.Item key="1">
            <span className="flex items-center gap-1 text-sm">
              <ApartmentOutlined style={{ fontSize: 12 }} />
              {t('Đăng ký thông tin dây chuyền sản xuất')}
            </span>
          </Menu.Item>

          <Menu.Item key="2">
            <span className="flex items-center gap-1 text-sm">
              <AppstoreAddOutlined style={{ fontSize: 12 }} />
              {t('Đăng ký thông tin danh mục sản phẩm')}
            </span>
          </Menu.Item>

          <Menu.Item
            key="buttons"
            disabled
            style={{
              marginLeft: 'auto',
              cursor: 'default',
              background: 'transparent'
            }}
          >
            <div className="flex gap-2 items-center">
              <Button type="text" icon={<PlusCircleFilled style={{ color: '#10b981' }} />} onClick={onInsertRow}>
                Chèn
              </Button>
              <Button type="text" icon={<MinusCircleFilled style={{ color: '#ef4444' }} />} onClick={removeRow}>
                Xóa
              </Button>
              <Button type="text" icon={<CaretUpFilled style={{ color: '#3333ff' }} />} onClick={() => {}}>
                Up
              </Button>
              <Button type="text" icon={<CaretDownFilled style={{ color: '#ff5c33' }} />} onClick={() => {}}>
                Down
              </Button>
            </div>
          </Menu.Item>
        </Menu>
        {current === '1' && (
          <ModelRouteSet
            defaultCols={defaultCols}
            gridData={gridData}
            setGridData={setGridData}
            cols={cols}
            setCols={setCols}
            numRows={numRows}
            setNumRows={setNumRows}
            defaultColsModels={defaultCols}
            gridDataModels={gridDataRoute}
            setGridDataModels={setGridDataRoute}
            colsModels={colsRoute}
            setColsModels={setColsRoute}
            numRowsModels={numRowsRoute}
            setNumRowsModels={setNumRowsRoute}
            onVisibleRegionChanged={onVisibleRegionChanged}
            onCellRouteClicked={onCellRouteClicked}
            selection={selection}
            setSelection={setSelection}
            selectionCategory={selectionCategory}
            setSelectionCategory={setSelectionCategory}
            selectionRoute={selectionRoute}
            setSelectionRoute={setSelectionRoute}
            onCellRouteDetailsClicked={onCellRouteDetailsClicked}
          />
        )}
        {current === '2' && (
          <ModelGroupCategory
            dataCategoryValue={dataCategoryValue}
            defaultCols={defaultColsCategory}
            gridData={gridDataCategory}
            setGridData={setGridDataCategory}
            cols={colsCategory}
            setCols={setColsCategory}
            numRows={numRowsCategory}
            setNumRows={setNumRowsCategory}
            handleRowAppend={handleRowAppendCategory}
            setEditedRows={setEditedRowsCategory}
            editedRows={editedRowsCategory}
            selectionCategory={selectionCategory}
            setSelectionCategory={setSelectionCategory}
            onCellCategoryClicked={onCellCategoryClicked}
          />
        )}
      </div>

      {contextHolder}
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default ManageModelPageDetails;
