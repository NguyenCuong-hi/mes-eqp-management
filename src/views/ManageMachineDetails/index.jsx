import React, { useCallback, useMemo, useState } from 'react';

// project import
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import AuDrAction from 'component/Actions/AuDrAction';
import { Form } from 'antd';
import RouteParameterQuery from './query/OperationParameterQ';
import RouteOperationQuery from './query/RouteOperationQ';
import { onRowAppended } from 'utils/sheets/onRowAppended';
import MachineInfomationQuery from './query/MachineInfomation';
import MachineReworkQuery from './query/RouteOperationReworkQ';
import EquipmentEventsQuery from './query/EquipmentEvents';
import { useNotify } from 'utils/hooks/onNotify';
import { useFullscreenLoading } from 'utils/hooks/useFullscreenLoading';

// ==============================||  PAGE ||============================== //

const ManageMachineDetails = ({ canCreate, canEdit, canDelete, canView }) => {
  const { t } = useTranslation();
  const { notify, contextHolder } = useNotify();
  const { spinning, percent, showLoader } = useFullscreenLoading();

  const defaultColsOp = useMemo(() => [
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
        disabled: true
      }
    },
    {
      title: t('ID'),
      id: 'id',
      kind: 'Text',
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
      title: t('Mã công đoạn'),
      id: 'OperationCode',
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
      title: t('Tên công đoạn'),
      id: 'OperationName',
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
      id: 'Description',
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

  const [colsOp, setColsOp] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_OP_LIST',
      defaultColsOp.filter((col) => col.visible)
    )
  );
  const [gridDataOp, setGridDataOp] = useState([]);
  const [numRowsOp, setNumRowsOp] = useState(0);

  const defaultColsRouteOp = useMemo(() => [
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
        disabled: true
      }
    },
    {
      title: t('RouteId'),
      id: 'RouteId',
      kind: 'Text',
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
      title: t('Id'),
      id: 'Id',
      kind: 'Text',
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
      title: t('Mã công đoạn'),
      id: 'OperationCode',
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
      title: t('Tên công đoạn'),
      id: 'OperationName',
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
      title: t('Mô tả'),
      id: 'Description',
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
      title: t('Trạng thái'),
      id: 'Status',
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

  const [colsRouteOp, setColsRouteOp] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_ROUTE_OP_LIST',
      defaultColsRouteOp.filter((col) => col.visible)
    )
  );
  const [gridDataRouteOp, setGridDataRouteOp] = useState([]);
  const [numRowsRouteOp, setNumRowsRouteOp] = useState(0);

  const defaultColsOpRework = useMemo(() => [
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
      title: t('RouteId'),
      id: 'RouteId',
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
      title: t('ID'),
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
      id: 'OperationCode',
      kind: 'Custom',
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
      title: t('Mã dây chuyền Rework'),
      id: 'RouteCodeRework',
      kind: 'Custom',
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
      title: t('Mã dây chuyền Rework'),
      id: 'RouteCodeRework',
      kind: 'Custom',
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
      title: t('Mã công đoạn Rework'),
      id: 'OperationCodeRework',
      kind: 'Custom',
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
      title: t('Mã dây chuyền Return'),
      id: 'RouteCodeReturn',
      kind: 'Custom',
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
      title: t('Mã công đoạn Return'),
      id: 'OperationCodeReturn',
      kind: 'Custom',
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
      title: t('Ghi chú'),
      id: 'note',
      kind: 'text',
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

  const [colsOpRework, setColsOpRework] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_OP_REWORK',
      defaultColsOpRework.filter((col) => col.visible)
    )
  );
  const [gridDataOpRework, setGridDataOpRework] = useState([]);
  const [numRowsOpRework, setNumRowsOpRework] = useState(0);
  const [numRowsToAddOpRework, setNumRowsToAddOpRework] = useState(null);
  const [addedRowsOpRework, setAddedRowsOpRework] = useState([]);

  const handleRowAppendOpRework = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsOpRework, setGridDataOpRework, setNumRowsOpRework, setAddedRowsOpRework, numRowsToAddOpRework);
    },
    [colsOpRework, setGridDataOpRework, setNumRowsOpRework, setAddedRowsOpRework, numRowsToAddOpRework]
  );

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
      id: 'PrompId',
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
      id: 'PrompName',
      kind: 'Custom',
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
      id: 'Description',
      kind: 'Text',
      readonly: true,
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
      id: 'MustInput',
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
    {
      title: t('ID giá trị thuộc tính'),
      id: 'PrompValueId',
      kind: 'Boolean',
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
      title: t('Giá trị thuộc tính'),
      id: 'PrompValue',
      kind: 'Boolean',
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

  const [colsCategory, setColsCategory] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_PRODUCT_CATEGORY',
      defaultColsCategory.filter((col) => col.visible)
    )
  );
  const [gridDataCategory, setGridDataCategory] = useState([]);
  const [numRowsCategory, setNumRowsCategory] = useState(0);
  const [numRowsToAddCategory, setNumRowsToAddCategory] = useState(null);
  const [addedRowsCategory, setAddedRowsCategory] = useState([]);

  const handleRowAppend = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsCategory, setGridDataCategory, setNumRowsCategory, setAddedRowsCategory, numRowsToAddCategory);
    },
    [colsCategory, setGridDataCategory, setNumRowsCategory, setAddedRowsCategory, numRowsToAddCategory]
  );

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
      title: t('RouteId'),
      id: 'RouteId',
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
      title: t('ID'),
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
      id: 'OperationCode',
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
      id: 'Description',
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
      title: t('Áp dụng'),
      id: 'IsUse',
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
      title: t('Số lượng chờ'),
      id: 'QueueNumber',
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
      title: t('Số lượng tiến hành'),
      id: 'ProcessNumber',
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
      title: t('Năng suất'),
      id: 'Yeild',
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

  const [colsOpIndicate, setColsOpIndicate] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_OP_INDICATE',
      defaultColsOpIndicate.filter((col) => col.visible)
    )
  );
  const [gridDataOpIndicate, setGridDataOpIndicate] = useState([]);
  const [numRowsOpIndicate, setNumRowsOpIndicate] = useState(0);
  const [numRowsToAddOpIndicate, setNumRowsToAddOpIndicate] = useState(null);
  const [addedRowsOpIndicate, setAddedRowsOpIndicate] = useState([]);

  const handleRowAppendOpIndicate = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsOpIndicate, setGridDataOpIndicate, setNumRowsOpIndicate, setAddedRowsOpIndicate, numRowsToAdd, numRowsToAddOpIndicate);
    },
    [colsOpIndicate, setGridDataOpIndicate, setNumRowsOpIndicate, setAddedRowsOpIndicate, numRowsToAddOpIndicate]
  );

  const cellConfigOpIndicate = [
    {
    
  }]

  const defaultColsEvent = useMemo(() => [
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
        disabled: true
      }
    },
    {
      title: t('ID'),
      id: 'id',
      kind: 'Text',
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
      title: t('Mã trạng thái'),
      id: 'EventCode',
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
      title: t('Tên trạng thái'),
      id: 'EventName',
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
      id: 'Description',
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

  const [colsEvent, setColsEvent] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_EVENT_LIST',
  defaultColsEvent.filter((col) => col.visible)
    )
  );
  const [gridDataEvent, setGridDataEvent] = useState([]);
  const [numRowsEvent, setNumRowsEvent] = useState(0);

  const defaultColsEqpEvent = useMemo(() => [
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
        disabled: true
      }
    },
    {
      title: t('ID'),
      id: 'id',
      kind: 'Text',
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
      title: t('Mã trạng thái'),
      id: 'EventCode',
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
      title: t('Tên trạng thái'),
      id: 'EventName',
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
      id: 'Description',
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

  const [colsEqpEvent, setColsEqpEvent] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_EQP_EVENT_LIST',
  defaultColsEqpEvent.filter((col) => col.visible)
    )
  );
  const [gridDataEqpEvent, setGridDataEqpEvent] = useState([]);
  const [numRowsEqpEvent, setNumRowsEqpEvent] = useState(0);

  const [formDataBasic] = Form.useForm();

 
  // Handle Action
  const handleClick = () => {
    showLoader(3000, () => {
      notify({
        type: 'success',
        message: 'Thành công',
        description: 'Thêm mới thành công'
      })
    });
  };

  const onFinish = (values) => {
    handleClick();
    console.log('Received values of form: ', values);
  };


  return (
    <>
      <div className="h-full pt-4 pr-4 pl-4">
        <AuDrAction
          titlePage={'Đăng ký thông tin thiết bị'}
          onClickSave={() => formDataBasic.submit()}
          onClickCancel={() => {
            
          }}
          onClickDelete={() => {}}
          onClickAdd={handleClick}
        />
        <MachineInfomationQuery formDataBasic={formDataBasic} onFinish={onFinish} />
        <RouteOperationQuery
          defaultColsOp={defaultColsOp}
          gridDataOp={gridDataOp}
          setGridDataOp={setGridDataOp}
          colsOp={colsOp}
          setColsOp={setColsOp}
          numRowsOp={numRowsOp}
          setNumRowsOp={setNumRowsOp}

          defaultColsRouteOp={defaultColsRouteOp}
          gridDataRouteOp={gridDataRouteOp}
          setGridDataRouteOp={setGridDataRouteOp}
          colsRouteOp={colsRouteOp}
          setColsRouteOp={setColsRouteOp}
          numRowsRouteOp={numRowsRouteOp}
          setNumRowsRouteOp={setNumRowsRouteOp}
        />
        <EquipmentEventsQuery
          defaultColsEvent={defaultColsEvent}
          gridDataEvent={gridDataEvent}
          setGridDataEvent={setGridDataEvent}
          colsEvent={colsEvent}
          setColsEvent={setColsEvent}
          numRowsEvent={numRowsEvent}
          setNumRowsEvent={setNumRowsEvent}

          defaultColsEqpEvent={defaultColsEqpEvent}
          gridDataEqpEvent={gridDataEqpEvent}
          setGridDataEqpEvent={setGridDataEqpEvent}
          colsEqpEvent={colsEqpEvent}
          setColsEqpEvent={setColsEqpEvent}
          numRowsEqpEvent={numRowsEqpEvent}
          setNumRowsEqpEvent={setNumRowsEqpEvent}
        />

        <RouteParameterQuery
          defaultCols={defaultColsCategory}
          gridData={gridDataCategory}
          setGridData={setGridDataCategory}
          cols={colsCategory}
          setCols={setColsCategory}
          numRows={numRowsCategory}
          setNumRows={setNumRowsCategory}
          handleRowAppend={handleRowAppend}
        />
      </div>
    </>
  );
};

export default ManageMachineDetails;
