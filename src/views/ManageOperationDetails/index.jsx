import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// project import
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import AuDrAction from 'component/Actions/AuDrAction';
import { onRowAppended } from 'utils/sheets/onRowAppended';
import { Button, Form, Menu, message, Spin, TreeSelect } from 'antd';
import {
  ApartmentOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  CaretDownFilled,
  CaretUpFilled,
  ClusterOutlined,
  ConsoleSqlOutlined,
  DashboardOutlined,
  DownCircleFilled,
  LoadingOutlined,
  MinusCircleFilled,
  MinusOutlined,
  MonitorOutlined,
  PartitionOutlined,
  PlusCircleFilled,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useFullscreenLoading } from 'utils/hooks/useFullscreenLoading';
import { useNotify } from 'utils/hooks/onNotify';
import { useSelector } from 'react-redux';
import useDynamicFilter from 'utils/hooks/useDynamicFilter';
import { SearchRouteBy } from 'services/ModelManage/SearchRouteBy';
import { filterAndSelectColumns } from 'utils/sheets/filterUorA';

import { DeleteCategoryBy } from 'services/ModelManage/DeleteCategoryBy';
import ModelGroupCategory from './query/ModelGroupCategory';
import RouteInfomationQuery from './query/OperationInfoQuery';
import Splitter from 'antd/es/splitter/Splitter';
import { SplitterPanel } from 'primereact/splitter';
import RouteSetTree from './table/RouteSetTree';
import RouteOperationSet from './query/OperationBasInfo';
import RouteSetOperationReworkTable from './table/RouteSetOperationReworkTable';
import RouteSetOpIndicateTable from './table/RouteSetOpIndicateTable';
import { SearchRouteTree } from 'services/RouteSetManage/SearchRouteTree';
import { getRouteById } from 'services/RouteSetManage/GetRouteById';
import { SearchOperationBy } from 'services/RouteSetManage/SearchOperationBy';
import { CreateRouteOperationByService } from 'services/RouteSetManage/CreateRouteOperationBy';
import { DeleteRouteOpBy } from 'services/RouteSetManage/DeleteRouteOpBy';
import { getRouteOpByRouteId } from 'services/RouteSetManage/GetRouteOpByRouteId';
import { CreateRouteByService } from 'services/RouteSetManage/CreateRouteByService';
import { getCategoryByRouteId } from 'services/RouteSetManage/GetCategoryByRouteId';
import OperationTable from './table/OperationTable';
import OperationInfoQuery from './query/OperationInfoQuery';
import OperationBasInfo from './query/OperationBasInfo';
import OperationEquipment from './query/OperationEquipment';
import OperationManageInfo from './query/OperationManageInfo';
import OperationPropertiesTable from './table/OperationPropertiesTable';

// ==============================|| MODEL PRODUCT PAGE ||============================== //

const ManageOperationDetails = ({ canCreate, canEdit, canDelete, canView }) => {
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

  const [selectionOperationRework, setSelectionOperationRework] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const [selectionOpIndicate, setSelectionOpIndicate] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });
  const [selectionOpProperties, setSelectionOpProperties] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const [operationSelected, setOperationSelected] = useState([]);
  const [addedRows, setAddedRows] = useState([]);
  const [numRowsToAdd, setNumRowsToAdd] = useState(null);
  const [editedRows, setEditedRows] = useState([]);
  const [editedRowsCategory, setEditedRowsCategory] = useState([]);

  const [categorySelected, setCategorySelected] = useState([]);
  const [routeOpSelected, setRouteOpSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [routeTree, setRouteTree] = useState([]);
  const [routeTreeSelected, setRouteTreeSelected] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectNode, setSelectNode] = useState(null);

  const [dataLossTable, setDataLossTable] = useState([]);
  const [dataSuccessTable, setDataSuccessTable] = useState([]);
  const [dataStep, setDataStep] = useState([]);
  const [dataUnit, setDataUnit] = useState([]);
  const [dataReworkTable, setDataReworkTable] = useState([]);

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
      title: t('Mã công đoạn'),
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
      title: t('Tên công đoạn'),
      id: 'operationName',
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
      title: t('Mã công đoạn'),
      id: 'operationCode',
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

  const defaultColsOpProperties = useMemo(() => [
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
      title: t('Mã thuộc tính '),
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
      title: t('Thuộc tính'),
      id: 'opProperties',
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
      title: t('Áp dụng'),
      id: 'isUse',
      kind: 'Boolean',
      readonly: true,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    
  ]);

  const [colsOpProperties, setColsOpProperties] = useState(() =>
    loadFromLocalStorageSheet(
      'S_OPERTATION_PROPERTY',
      defaultColsOpProperties.filter((col) => col.visible)
    )
  );
  const [gridDataOpProperties, setGridDataOpProperties] = useState([]);
  const [numRowsOpProperties, setNumRowsOpProperties] = useState(0);

  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);

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

  const defaultColsOpPropertiesRework = useMemo(() => [
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
      title: t('Mã'),
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
      title: t('Mã công đoạn'),
      id: 'operationId',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },

    {
      title: t('Mã công đoạn'),
      id: 'operationCode',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên công đoạn'),
      id: 'operationName',
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
      title: t('Mã dây chuyền Rework'),
      id: 'routeIdRework',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên dây chuyền Rework'),
      id: 'routerNameRework',
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
      title: t('Mã dây chuyền Rework'),
      id: 'routeCodeRework',
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
      title: t('Tên công đoạn Rework'),
      id: 'operationReworkName',
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
      title: t('Mã công đoạn Rework'),
      id: 'operationReworkId',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },

    {
      title: t('Mã công đoạn Rework'),
      id: 'operationReworkCode',
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
      title: t('Mã dây chuyền trả về'),
      id: 'routeReturnId',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tên dây chuyền trả về'),
      id: 'routeReturnName',
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
      title: t('Mã dây chuyền trả về'),
      id: 'routeReturnCode',
      kind: 'Custom',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    }
  ]);

  const [colsOperationRework, setColsOperationRework] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ROUTE_OPERATION_REWORK',
      defaultColsOpPropertiesRework.filter((col) => col.visible)
    )
  );
  const [gridDataOperationRework, setGridDataOperationRework] = useState([]);
  const [numRowsOperationRework, setNumRowsOperationRework] = useState(0);
  const [numRowsToAddOpProperties, setNumRowsToAddOperationRework] = useState(null);
  const [addedRowsOpProperties, setAddedRowsOpProperties] = useState([]);

  const [OperationReworkSelected, setOperationReworkSelected] = useState([]);
  const [editedRowsOperationRework, setEditedRowsOperationRework] = useState([]);

  const defaultColsOpIndicate = useMemo(() => [
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
      title: t('Mã'),
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
      title: t('Mã dây chuyền'),
      id: 'routeId',
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
      title: t('Mã công đoạn'),
      id: 'operationId',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },

    {
      title: t('Tên công đoạn'),
      id: 'operationName',
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
      title: t('Mã công đoạn'),
      id: 'operationCode',
      kind: 'Text',
      readonly: true,
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
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Đang áp dụng'),
      id: 'isUse',
      kind: 'Boolean',
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
      title: t('Số lượng chờ'),
      id: 'queueNumber',
      kind: 'Text',
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
      title: t('Số lượng tiến hành'),
      id: 'processNumber',
      kind: 'Text',
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
      title: t('Năng suất'),
      id: 'yield',
      kind: 'Text',
      readonly: false,
      width: 250,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderRowID,
      trailingRowOptions: {
        disabled: true
      }
    }
  ]);

  const [colsOpIndicate, setColsOpIndicate] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ROUTE_OP_INDICATE',
      defaultColsOpIndicate.filter((col) => col.visible)
    )
  );
  const [gridDataOpIndicate, setGridDataOpIndicate] = useState([]);
  const [numRowsOpIndicate, setNumRowsOpIndicate] = useState(0);
  const [numRowsToAddOpIndicate, setNumRowsToAddOpIndicate] = useState(null);
  const [addedRowsOpIndicate, setAddedRowsOpIndicate] = useState([]);

  const [OpIndicateSelected, setOpIndicateSelected] = useState([]);
  const [editedRowsOpIndicate, setEditedRowsOpIndicate] = useState([]);

  const [isSent, setIsSent] = useState(false);
  const [count, setCount] = useState(0);
  const lastWordEntryRef = useRef(null);
  const fieldsToTrack = ['IdxNo'];
  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(gridData, fieldsToTrack);

  const [routeId, setRouteId] = useState(null);
  const [routeCode, setRouteCode] = useState(null);
  const [routeName, setRouteName] = useState(null);

  //  Data Input
  const [formBasic] = Form.useForm();

  const dataCategoryValue = [
    { MinorName: '8080', Value: 1 },
    { MinorName: '8000', Value: 2 },
    { MinorName: '3000', Value: 3 }
  ];

  const [checkPageA, setCheckPageA] = useState(false);
  const [current, setCurrent] = useState('1');

  const onClickSave = useCallback(async () => {
    const requiredColumns = ['configProdName'];

    const columnOpRework = [
      'id',
      'operationId',
      'operationCode',
      'operationName',
      'routeIdRework',
      'routeCodeRework',
      'routerNameRework',
      'operationReworkId',
      'operationReworkCode',
      'operationReworkName',
      'routeReturnId',
      'routeReturnCode',
      'routeReturnName'
    ];

    const columnOpIndicate = [
      'id',
      'routeId',
      'operationId',
      'operationCode',
      'operationName',
      'description',
      'isUse',
      'queueNumber',
      'processNumber',
      'yield'
    ];

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
      const data = await formBasic.getFieldValue();

      const dataOpReworkA = filterAndSelectColumns(gridDataOperationRework, columnOpRework, 'A').map((row) => ({
        ...row,
        Status: 'A',
        id: row.id || '',
        routeId: data.id || ''
      }));

      const dataOpReworkU = filterAndSelectColumns(gridDataOperationRework, columnOpRework, 'U').map((row) => ({
        ...row,
        Status: 'U',
        id: row.id || '',
        routeId: data.id || ''
      }));

      const dataOpIndicateA = filterAndSelectColumns(gridDataOpIndicate, columnOpIndicate, 'A').map((row) => ({
        ...row,
        Status: 'A',
        id: row.id || '',
        routeId: routeId || ''
      }));

      const dataOpIndicateU = filterAndSelectColumns(gridDataOpIndicate, columnOpIndicate, 'U').map((row) => ({
        ...row,
        Status: 'U',
        id: row.id || '',
        routeId: routeId || ''
      }));

      const dataCategoryA = filterAndSelectColumns(gridDataCategory, columnsCategory, 'A').map((row) => ({
        ...row,
        Status: 'A',
        id: row.id || '',
        routeId: routeId || ''
      }));

      const dataCategoryU = filterAndSelectColumns(gridDataCategory, columnsCategory, 'U').map((row) => ({
        ...row,
        Status: 'U',
        id: row.id || '',
        routeId: routeId || ''
      }));

      const dataRework = [...dataOpReworkA, ...dataOpReworkU];
      const dataIndicate = [...dataOpIndicateA, ...dataOpIndicateU];

      const dataCategory = [...dataCategoryA, ...dataCategoryU];
      const dto = {
        route: {
          id: routeId || '',
          ...data
        },
        prompts: dataCategory,
        reworks: dataRework,
        indications: dataIndicate
      };
      try {
        const result = await CreateRouteByService(dto);

        if (result.success) {
          notify({
            type: 'success',
            message: 'Thành công',
            description: 'Cập nhật thành công!'
          });

          setIsSent(false);
          setEditedRows([]);
          console.log('routeId', routeId);
          fetchDataRoutById(routeId);
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
        onFetchRoute();

        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }, [formBasic, gridDataCategory, gridDataOpProperties, isAPISuccess, routeId, gridDataOperationRework, gridDataOpIndicate]);

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

      const response = await SearchRouteTree(data);
      const fetchedData = response.data || [];

      const dataTree = fetchedData.map((item) => ({
        title: item.route.routeCode,
        value: item.route.id,
        key: item.route.id,
        icon: <ClusterOutlined />,
        children: item.routeOperations.map((operation) => ({
          title: operation.operationCode,
          value: operation.id,
          key: operation.id,
          icon: <ApiOutlined />
        }))
      }));

      setRouteTree(dataTree);
    } catch (error) {
      setRouteTree([]);
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

  const onFetchOperation = useCallback(async () => {
    if (!isAPISuccess) {
      message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
      return;
    }

    if (controllers.current && controllers.current.onFetchOperation) {
      controllers.current.onFetchOperation.abort();
      controllers.current.onFetchOperation = null;
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

    controllers.current.onFetchOperation = controller;

    setIsAPISuccess(false);

    try {
      const data = {
        Keyword: keyword,
        PageIndex: pageIndex,
        PageSize: pageSize
      };

      const response = await SearchOperationBy(data);
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
      controllers.current.onFetchOperation = null;
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }, [gridData, numRows, keyword, pageIndex, pageSize, isAPISuccess]);

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
    const selectedRows = selectionOpProperties.rows.items;

    return selectedRows.flatMap(([start, end]) =>
      Array.from({ length: end - start }, (_, i) => gridDataOpProperties[start + i]).filter((row) => row !== undefined)
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
            setOperationSelected(getSelectedRowsData());
          } else {
            newSelected = selection.rows.add(rowIndex);
            setOperationSelected([]);
          }
        }
      }
    },
    [gridData, getSelectedRowsData, operationSelected]
  );

  const onCellOpPropertiesClicked = useCallback(
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
        if (rowIndex >= 0 && rowIndex < gridDataOpProperties.length) {
          const isSelected = selectionOpProperties.rows.hasIndex(rowIndex);

          let newSelected;
          if (isSelected) {
            newSelected = selectionOpProperties.rows.remove(rowIndex);
            setRouteOpSelected(getSelectedRowsRouteDetailsData());
          } else {
            newSelected = selectionOpProperties.rows.add(rowIndex);
            setRouteOpSelected([]);
          }
        }
      }
    },
    [gridDataOpProperties, getSelectedRowsRouteDetailsData, routeOpSelected]
  );

  const onTreeClicked = useCallback((selectedKeys, info) => {
    if (info.node.value) {
      fetchDataRoutById(info.node.value);
    }
  }, []);

  const fetchDataRoutById = useCallback(
    async (routeId) => {
      if (!isAPISuccess) {
        message.warning('Không thể thực hiện, vui lòng kiểm tra trạng thái.');
        return;
      }

      if (controllers.current && controllers.current.fetchDataRoutById) {
        controllers.current.fetchDataRoutById.abort();
        controllers.current.fetchDataRoutById = null;
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

      controllers.current.fetchDataRoutById = controller;

      setIsAPISuccess(false);

      try {
        const response = await getRouteById(routeId);
        const fetchedData = response.data || [];

        formBasic.setFieldsValue({
          routeName: fetchedData.route.routeCode,
          description: fetchedData.route.description,
          routeCode: fetchedData.route.routeCode
        });

        setRouteId(fetchedData.route.id);
        setRouteCode(fetchedData.route.routeCode);
        setRouteName(fetchedData.route.routeName);

        setGridDataOpProperties(fetchedData.routeOperation || []);
        setNumRowsOpProperties(fetchedData.routeOperation?.length || 0);

        setGridDataOperationRework(fetchedData.reworkOperation || []);
        setNumRowsOperationRework(fetchedData.reworkOperation?.length || 0);

        setGridDataOpIndicate(fetchedData.indicatesOperation || []);
        setNumRowsOpIndicate(fetchedData.indicatesOperation?.length || 0);

        setGridDataCategory(fetchedData.promptCategoryResDto || []);
        setNumRowsCategory(fetchedData.promptCategoryResDto?.length || 0);
      } catch (error) {
        console.log(error);
        setGridDataOpProperties([]);
        setNumRowsOpProperties(0);
        setGridDataOperationRework([]);
        setNumRowsOperationRework(0);
        setGridDataOpIndicate([]);
        setNumRowsOpIndicate(0);
        setGridDataCategory([]);
        setNumRowsCategory(0);
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
    },
    [
      routeTree,
      routeTreeSelected,
      formBasic,
      routeId,
      routeCode,
      routeName,
      gridDataOpProperties,
      gridDataOperationRework,
      gridDataOpIndicate,
      gridDataCategory,
      isAPISuccess,
      numRows,
      numRowsOpProperties,
      numRowsOperationRework,
      numRowsOpIndicate,
      numRowsCategory
    ]
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
    onFetchRoute();
    onFetchOperation();
  }, [selectedData]);

  const onInsertRow = useCallback(async () => {
    if (!Array.isArray(operationSelected) || operationSelected.length === 0) {
      console.warn('operationSelected is empty or invalid');
      return;
    }

    try {
      const dto = operationSelected.map((item) => ({
        routeId: routeId,
        routeCode: routeCode,
        routeName: routeName,

        operationId: item.id,
        operationCode: item.operationCode,
        operationName: item.operationName,
        description: item.description
      }));

      const result = await CreateRouteOperationByService(dto);

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
    } finally {
      onFetchRoute();
      fetchDataRoutById(routeId);
    }

    setGridDataOpProperties((prevGridData) => {
      const updatedGridData = [...prevGridData];

      let addedCount = 0;

      operationSelected.forEach((newItem) => {
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

      setNumRowsOpProperties((prevNumRows) => prevNumRows + addedCount);

      return updatedGridData;
    });
  }, [operationSelected, routeId, routeCode, routeName]);

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
        if (routeOpSelected.length === 0 && categorySelected.length === 0) {
          message.warning('Vui lòng chọn ít nhất một dòng để xóa');
          return;
        }
        let response;
        if (routeOpSelected.length > 0) {
          const ids = routeOpSelected.map((item) => item.id).filter((id) => id !== undefined);
          response = await DeleteRouteOpBy(ids);
          const Ops = await getRouteOpByRouteId(routeId);
          setGridDataOpProperties(Ops.data);
          setNumRowsOpProperties(Ops.data.length);
        }
        if (categorySelected.length > 0) {
          const idCategory = categorySelected.map((item) => item.id).filter((id) => id !== undefined);
          response = await DeleteCategoryBy(idCategory);
          const category = await getCategoryByRouteId(routeId);
          setGridDataCategory(category.data);
          setNumRowsCategory(category.data.length);
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
        onFetchRoute();
        controllers.current.removeRow = null;
        if (loadingBarRef.current) {
          loadingBarRef.current.complete();
        }
      }
    },
    [gridDataOpProperties, gridDataCategory, categorySelected, routeOpSelected]
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

  const handleRowAppendOpProperties = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsOpProperties, setGridDataOpProperties, setNumRowsOpProperties, setAddedRowsOpProperties, numRowsToAdd);
    },
    [colsOpProperties, setGridDataOpProperties, setNumRowsOpProperties, setAddedRowsOpProperties, numRowsToAddOpProperties]
  );

  const handleRowAppendOpIndicate = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsOpIndicate, setGridDataOpIndicate, setNumRowsOpIndicate, setAddedRowsOpIndicate, numRowsToAdd);
    },
    [colsOpIndicate, setGridDataOpIndicate, setNumRowsOpIndicate, setAddedRowsOpIndicate, numRowsToAddOpIndicate]
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
      let response = {};
      if (selectedData.length > 0) {
        const ids = selectedData.map((item) => item.id).filter((id) => id !== undefined);
        response = await DeleteRouteOpBy(ids);
      }

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
        setGridDataOpProperties([]);
        setNumRowsOpProperties(0);
        formBasic.resetFields();

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
  }, [selectedData, gridDataOpProperties, gridDataCategory, formBasic, isAPISuccess]);

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(e.target.value);
    }
  };

  return (
    <>
      <div className="h-full pt-4">
        <AuDrAction
          titlePage={'Đăng ký công đoạn sản xuất'}
          onClickDelete={onClickDelete}
          onClickSave={onClickSave}
          onClickUpdate={() => {}}
          onClickReset={() => {}}
        />
        <Splitter className="w-full h-full ">
          <SplitterPanel size={30} minSize={10}>
            <div className="w-full  h-full bg-white  overflow-x-hidden overflow-hidden  ">
              <div className="w-full h-[30px]  items-center border-b border-gray-200 ">
                <div className="w-full h-full flex gap-2">
                  {isLoading ? <LoadingOutlined className="animate-spin" /> : <SearchOutlined />}
                  <input
                    value={keyword}
                    onChange={onSearch}
                    onKeyDown={onKeyDown}
                    highlight={true}
                    autoFocus={true}
                    className="border-none focus:outline-none hover:border-none bg-inherit"
                  />
                </div>
              </div>
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
            </div>
          </SplitterPanel>
          <SplitterPanel size={75} minSize={10}>
            <OperationInfoQuery formBasic={formBasic} />

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
                  {t('Thông tin')}
                </span>
              </Menu.Item>

              <Menu.Item key="2">
                <span className="flex items-center gap-1 text-sm">
                  <SyncOutlined style={{ fontSize: 12 }} />
                  {t('Thiết bị')}
                </span>
              </Menu.Item>

              <Menu.Item key="3">
                <span className="flex items-center gap-1 text-sm">
                  <AppstoreAddOutlined style={{ fontSize: 12 }} />
                  {t('Trình tự công đoạn')}
                </span>
              </Menu.Item>

              <Menu.Item key="4">
                <span className="flex items-center gap-1 text-sm">
                  <AppstoreAddOutlined style={{ fontSize: 12 }} />
                  {t('Thông số')}
                </span>
              </Menu.Item>
              
              <Menu.Item key="5">
                <span className="flex items-center gap-1 text-sm">
                  <DashboardOutlined style={{ fontSize: 12 }} />
                  {t('Danh mục')}
                </span>
              </Menu.Item>
              {current === '1' && (
                <Menu.Item
                  key="buttons"
                  disabled
                  style={{
                    marginLeft: 'auto',
                    cursor: 'default',
                    background: 'transparent'
                  }}
                >
                  <div className="flex gap-1 items-center">

                    <Button type="text" icon={<PlusCircleFilled style={{ color: '#10b981', padding: 0 }} />} onClick={onInsertRow}>
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
              )}
              {current === '4' && (
                <Menu.Item
                  key="buttons"
                  disabled
                  style={{
                    marginLeft: 'auto',
                    cursor: 'default',
                    background: 'transparent'
                  }}
                >
                  <div className="flex gap-1 items-center">
                    <Button type="text" icon={<PlusCircleFilled style={{ color: '#10b981', padding: 0 }} />} onClick={onInsertRow}>
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
              )}
            </Menu>
            {current === '1' && (
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
                          defaultCols={defaultColsOpProperties}
                          gridData={gridDataOpProperties}
                          setGridData={setGridDataOpProperties}
                          cols={colsOpProperties}
                          setCols={setColsOpProperties}
                          numRows={numRowsOpProperties}
                          setNumRows={setNumRowsOpProperties}
                          selection={selectionOpProperties}
                          setSelection={setSelectionOpProperties}
                        />
                      </SplitterPanel>
                    </Splitter>
                  </div>
            )}
            {current === '2' && (
              <OperationEquipment
                defaultCols={defaultCols}
                gridData={gridData}
                setGridData={setGridData}
                cols={cols}
                setCols={setCols}
                numRows={numRows}
                setNumRows={setNumRows}
                defaultColsOpRoute={defaultCols}
                gridDataOpProperties={gridDataOpProperties}
                setGridDataOpProperties={setGridDataOpProperties}
                colsOpProperties={colsOpProperties}
                setColsOpProperties={setColsOpProperties}
                numRowsOpProperties={numRowsOpProperties}
                setNumRowsOpProperties={setNumRowsOpProperties}
                onVisibleRegionChanged={onVisibleRegionChanged}
                onCellRouteClicked={onCellRouteClicked}
                selection={selection}
                setSelection={setSelection}
                selectionCategory={selectionCategory}
                setSelectionCategory={setSelectionCategory}
                selectionOpProperties={selectionOpProperties}
                setSelectionOpProperties={setSelectionOpProperties}
                onCellOpPropertiesClicked={onCellOpPropertiesClicked}
              />
            )}
            {current === '3' && (
              <RouteSetOpIndicateTable
                defaultCols={defaultColsOpIndicate}
                gridData={gridDataOpIndicate}
                setGridData={setGridDataOpIndicate}
                cols={colsOpIndicate}
                setCols={setColsOpIndicate}
                numRows={numRowsOpIndicate}
                setNumRows={setNumRowsOpIndicate}
                handleRowAppend={handleRowAppendOpIndicate}
                setEditedRows={setEditedRowsOpIndicate}
                selection={selectionOpIndicate}
                setSelection={setSelectionOpIndicate}
                onCellClicked={onCellCategoryClicked}
                controllers={controllers}
                loadingBarRef={loadingBarRef}
                setIsAPISuccess={setIsAPISuccess}
                isAPISuccess={isAPISuccess}
              />
            )}
            {current === '4' && (
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
          </SplitterPanel>
        </Splitter>
      </div>

      {contextHolder}
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default ManageOperationDetails;
