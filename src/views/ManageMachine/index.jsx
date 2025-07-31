import React, { useMemo, useState } from 'react';

// project import

import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import RouteSetTable from './table/MachinePageTable';
import RouteSetAction from './action/MachinePageAction';
import { useNotify } from 'utils/hooks/onNotify';
import { Spin } from 'antd';
import { useFullscreenLoading } from 'utils/hooks/useFullscreenLoading';
import MachinePageTable from './table/MachinePageTable';
import MachinePageAction from './action/MachinePageAction';

// ==============================|| ROUTER SET PAGE ||============================== //

const ManageMachinePage = ({}) => {
  const { t } = useTranslation();
  const { notify, contextHolder } = useNotify();
  const { spinning, percent, showLoader } = useFullscreenLoading();

  const handleClick = () => {
    showLoader(3000, () => {
      notify({
        type: 'success',
        message: 'Thành công',
        description: 'Thêm mới thành công'
      })
    });
  };

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
      title: t('Mã thiết bị'),
      id: 'MachineCode',
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
      title: t('Tên thiết bị'),
      id: 'MachineName',
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
    },
    {
      title: t('Nhãn hiệu'),
      id: 'Model',
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
      title: t('Nhà cung cấp'),
      id: 'Vendor',
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
      title: t('Loại thiết bị'),
      id: 'Type',
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
      title: t('Khu vực áp dụng'),
      id: 'Location',
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
      title: t('Trạng thái thiết bị'),
      id: 'Status',
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
      title: t('Trung tâm hoạt động'),
      id: 'WorkCenter',
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
      title: t('Trung tâm hoạt động'),
      id: 'WorkCenter',
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
      title: t('Mã tài sản'),
      id: 'AssetCode',
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
      title: t('Sản phẩm áp dụng'),
      id: 'ApplicableProduct',
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
      title: t('Đơn vị lắp ráp'),
      id: 'Assembler',
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
      title: t('Giá mua'),
      id: 'PurchasePrice',
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
      title: t('Ngày nhập kho'),
      id: 'WarehouseDate',
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
      title: t('Tình trạng'),
      id: 'MachineStatus',
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
      title: t('Chiều dài'),
      id: 'Length',
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
      title: t('Chiều rộng'),
      id: 'Width',
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
      title: t('Chiều cao'),
      id: 'Height',
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
      title: t('Cân nặng'),
      id: 'Weight',
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
      title: t('Mức tiêu thụ điện'),
      id: 'Power',
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
      'S_ERP_COLS_PAGE_MACHINE',
      defaultCols.filter((col) => col.visible)
    )
  );
  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);

  return (
    <>
      <div className="h-full mt-4 pr-4 pl-4">
        <MachinePageAction
          titlePage={'Danh sách thiết bị'}
          onSearch={''}
          onClickSearch={() => notify({
            type: 'success',
            message: 'Thành công',
            description: 'Bạn vừa nhấn tìm kiếm'
          })}
          onClickFilter={''}
          keyword={''}
          setKeyword={''}
          onClickNew={handleClick}
        />
        <MachinePageTable
          defaultCols={defaultCols}
          gridData={gridData}
          setGridData={setGridData}
          cols={cols}
          setCols={setCols}
          numRows={numRows}
          setNumRows={setNumRows}
        />
      </div>
      {contextHolder}
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default ManageMachinePage;
