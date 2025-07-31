import React, { useEffect, useMemo, useState } from 'react';

// project import
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import SysMaster from './table/SysMaster';
import SysCodeAction from './action/SysCodeAction';
import AuDrAction from 'component/Actions/AuDrAction';


// ==============================|| MODEL PRODUCT PAGE ||============================== //

const ManageCodeSys = () => {
  const { t } = useTranslation();

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
      title: t('Tên đơn vị sản xuất'),
      id: 'FactUnitName',
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
      title: t('Tên đơn vị sản xuất'),
      id: 'FactUnitName',
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
      'S_ERP_COLS_PAGE_IQC_OUTSOURCE_STATUS_LIST',
      defaultCols.filter((col) => col.visible)
    )
  );
  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);


  return (
    <>
      <div className="h-full pt-4 pr-4 pl-4">
        <AuDrAction 
        title={"Đăng ký thông tin hệ thống"}
        />
        <SysMaster/>
      </div>
    </>
  );
};

export default ManageCodeSys;
