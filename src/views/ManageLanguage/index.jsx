import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
// project import
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { CompactSelection, GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import UsersAction from './action/UsersAction';
import RolesUsersMaster from './table/RoleUsersMaster';
import { onRowAppended } from 'utils/sheets/onRowAppended';
import { message, Spin } from 'antd';
import useDynamicFilter from 'utils/hooks/useDynamicFilter';
import { filterAndSelectColumns } from 'utils/sheets/filterUorA';
import { validateCheckColumns } from 'utils/sheets/validateColumns';
import { CreateByService } from 'services/ManageUsers/CreateByService';
import { useNotify } from 'utils/hooks/onNotify';
import { useFullscreenLoading } from 'utils/hooks/useFullscreenLoading';
import { SearchBy } from 'services/ManageUsers/SearchBy';
import { updateEditedRows } from 'utils/sheets/updateEditedRows';
import useConfirmDialog from 'utils/hooks/useConfirmDialog';
import { DeleteUserByService } from 'services/ManageUsers/DeleteUserByService';
import { CreateRoleByService } from 'services/ManageUsers/CreateRoleByService';
import { getUserByRole } from 'services/ManageUsers/GetUserByRole';
import { debounce } from 'lodash';
import LanguageTable from './table/LanguageTable';
import { SearchLangBy } from 'services/Lang/SearchLangBy';
import { CreateLangByService } from 'services/Lang/CreateLangByService';
import LanguageAction from './action/LanguageAction';

// ==============================|| ACCOUNT PRODUCT PAGE ||============================== //

const ManageLanguage = ({ canCreate }) => {
  const { t } = useTranslation();
  const { notify, contextHolder } = useNotify();
  const { spinning, percent, showLoader, hideLoader } = useFullscreenLoading();
  const [isAPISuccess, setIsAPISuccess] = useState(true);
  const { showConfirm } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(false);

  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [numRowsToAdd, setNumRowsToAdd] = useState(null);
  const [addedRows, setAddedRows] = useState([]);
  const [editedRowsUsers, setEditedRows] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [keyword, setKeyword] = useState('');

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
      title: t('Mã ngôn ngữ'),
      id: 'langCode',
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
      title: t('Tiếng Việt'),
      id: 'langVi',
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
      title: t('Tiếng Việt'),
      id: 'langCodeVi',
      kind: 'Text',
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
      title: t('Tiếng Anh'),
      id: 'langEn',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: true,
      icon: GridColumnIcon.HeaderSingleValue,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tiếng Anh'),
      id: 'langCodeEn',
      kind: 'Text',
      readonly: false,
      width: 200,
      hasMenu: true,
      visible: false,
      icon: GridColumnIcon.HeaderSingleValue,
      trailingRowOptions: {
        disabled: true
      }
    },
    {
      title: t('Tiếng Hàn'),
      id: 'langKo',
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
      title: t('Tiếng Hàn'),
      id: 'langCodeKo',
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
  ]);

  const [cols, setCols] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_LANGUAGE',
      defaultCols.filter((col) => col.visible)
    )
  );

  const [editedRowsRoles, setEditedRowsRoles] = useState([]);

  const handleRowAppend = useCallback(
    (numRowsAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRows, numRowsAdd);
    },
    [cols, setGridData, setNumRows, setAddedRows, numRowsToAdd]
  );

  const fieldsToTrack = ['Select', 'BizUnitName', 'BizUnit'];

  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(gridData, fieldsToTrack);

  const [count, setCount] = useState(0);
  const lastWordEntryRef = useRef(null);
  const [isSent, setIsSent] = useState(false);

  //   Load
  const fetchData = useCallback(async () => {
    if (!isAPISuccess) return;
    setIsAPISuccess(false);
    try {
      const data = [
        {
          pageIndex: pageIndex,
          pageSize: pageSize,
          keywork: keyword || ''
        }
      ];

      const response = await SearchLangBy(data);
      const fetchedData = response.data || [];
      setGridData(fetchedData);
      setNumRows(fetchedData.length);
    } catch (error) {
      setGridData([]);
      setNumRows(0);
    } finally {
      setIsAPISuccess(true);
    }
  }, [keyword, pageIndex, pageSize, isAPISuccess]);

  useEffect(() => {
    fetchData();
  }, []);

  //   Action
  const onClickSave = useCallback(async () => {
    showLoader();
    const requiredColumns = ['langCode', 'langCodeVi', 'langCodeEn', 'langCodeKo', 'langVi', 'langEn', 'langKo'];

    const commonColumns = [
      'id',
      
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

    const resulU = filterAndSelectColumns(gridData, commonColumns, 'U');
    const resulA = filterAndSelectColumns(gridData, commonColumns, 'A');


    const validationMessage = validateCheckColumns([...resulU, ...resulA], [...commonColumns, ...commonColumns], requiredColumns);

    const langNew = resulA.map((item) => {
      return {
        ...item,
      };
    });

    const langEdit = resulU.map((item) => {
      return {
        ...item,
        roles: [clickedRowData.name],
        confirmPassword: item.password,
        userAuthorities: ['USER.CREATE']
      };
    });

    if (validationMessage !== true) {
      message.warning(validationMessage);
      return;
    }

    if (isSent) return;
    setIsSent(true);

    const dataLang = [...langNew, ...langEdit];

    try {
      const promises = [];

      if (dataLang.length > 0) promises.push(CreateLangByService(dataLang));

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        if (result?.success && result?.data) {
          setEditedRows([]);
          hideLoader();
          notify({
            type: 'success',
            message: 'Thành công',
            description: index === 0 ? 'Thêm mới thành công' : 'Cập nhật thành công'
          });
          const data = {
            roleCode: clickedRowData.name,
            page: 0,
            size: 10
          };
          fetchUserByRoles(data);
        } else {
          hideLoader();
          notify({
            type: 'error',
            message: 'Lỗi',
            description: result?.message || 'Đã có lỗi xảy ra, thử lại'
          });
        }
      });
    } catch (error) {
      console.error(error);
      notify({
        type: 'error',
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra, thử lại'
      });
    } finally {
      setIsSent(false);
      hideLoader();
    }
  }, [editedRowsUsers]);

  const [columns, setColumns] = useState([]);

  const onClickImport = async (file) => {
    if (!file) return false;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const rowData = XLSX.utils.sheet_to_json(worksheet);

    if (rowData.length === 0) return false;

    const colHeaders = Object.keys(rowData[0]);
    setColumns(
      colHeaders.map((header, index) => ({
        title: header || `Column ${index + 1}`,
        id: String(index)
      }))
    );

    const dataAddStatus = rowData.map((row) => {
      return {
        ...row,
        Status: 'A'
      };
    });
    setGridData(dataAddStatus);
    setNumRows(dataAddStatus.length);

    return false;
  };

  const [isMinusClicked, setIsMinusClicked] = useState(false);
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [clickedRowData, setClickedRowData] = useState(null);

  const fetchUserByRoles = async (data) => {
    setIsLoading(true);
    try {
      const result = await getUserByRole(data);
      if (result?.success && result?.data) {
        setGridData(result?.data);
        setNumRows(result?.data.length);
        setIsLoading(false);
      } else {
        notify({
          type: 'error',
          message: 'Lỗi',
          description: result?.message || 'Đã có lỗi xảy ra, thử lại'
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        type: 'error',
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra, thử lại'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isMinusClickedUser, setIsMinusClickedUser] = useState(false);
  const [lastClickedCellUser, setLastClickedCellUser] = useState(null);
  const [clickedRowDataUser, setClickedRowDataUser] = useState(null);
  const [selected, setSelect] = useState([]);

  const [selection, setSelection] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const onCellClicked = useCallback(
    (cell, event) => {
      let rowIndex;

      if (cell[0] === -1) {
        rowIndex = cell[1];
        setIsMinusClickedUser(true);
      } else {
        rowIndex = cell[1];
        setIsMinusClickedUser(false);
      }

      if (lastClickedCell && lastClickedCell[0] === cell[0] && lastClickedCell[1] === cell[1]) {
        setLastClickedCellUser(null);
        setClickedRowDataUser(null);
        return;
      }

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        setSelect(getSelectedRows());
      }
    },
    [gridData, selected, selection]
  );

  const getSelectedRows = () => {
    const selectedRows = selection.rows.items;
    let rows = [];
    selectedRows.forEach((range) => {
      const start = range[0];
      const end = range[1] - 1;

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridData[i]);

          setGridData((prev) => {
            const newData = [...prev];
            const product = gridData[i];

            if (product.id) {
              product['Status'] = 'U';
            } else {
              product['Status'] = 'A';
            }

            setEditedRows((prevEditedRows) => updateEditedRows(prevEditedRows, product, newData, ''));

            return newData;
          });
        }
      }
    });

    return rows;
  };

  const handleDelete = useCallback(async () => {
    if (selected.length === 0) {
      notify({
        type: 'error',
        message: 'Lỗi',
        description: 'Không có dữ liệu để xóa!'
      });
      setIsSent(false);
      throw new Error('Không có dữ liệu');
    }

    try {
      const promises = [];
      const ids = selected.map((item) => item.id).filter((id) => id !== undefined);
      if (selected.length > 0) promises.push(DeleteUserByService(ids));

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result?.success && result?.data) {
          notify({
            type: 'success',
            message: 'Thành công',
            description: 'Xóa thành công'
          });
          const data = {
            roleCode: clickedRowData.name,
            page: 0,
            size: 10
          };
          fetchUserByRoles(data);
        } else {
          notify({
            type: 'error',
            message: 'Lỗi',
            description: result?.message || 'Đã có lỗi xảy ra, thử lại'
          });
        }
      });
    } catch (error) {
      console.error(error);
      notify({
        type: 'error',
        message: 'Lỗi',
        description: 'Đã có lỗi xảy ra, thử lại'
      });
      throw error;
    } finally {
      setIsSent(false);
    }
  }, [selected, clickedRowData]);

  const onClickDelete = useCallback(() => {
    showConfirm({
      title: 'Xác nhận xóa bản ghi?',
      content: '',
      onOk: async () => {
        return handleDelete();
      }
    });
  }, [selected]);

  const debounceSearch = useMemo(
    () =>
      debounce((value, roleCode) => {
        if (value.trim()) {
          const data = {
            roleCode: roleCode,
            keyword: value,
            page: 0,
            size: 10
          };
          fetchUserByRoles(data);
        }
      }, 500),
    []
  );

  const onSearch = useCallback(
    (value) => {
      const keyword = value.target.value;
      debounceSearch(keyword, clickedRowData.name);
    },
    [clickedRowData]
  );

  return (
    <>
      <div className="h-full pt-4">
        <LanguageAction titlePage={t('Từ điển')} keyword={keyword} setKeyword={setKeyword} onClickSearch={onSearch} onClickSave={onClickSave} onClickDelete={onClickDelete} onClickImport={onClickImport} />
        <div className="bg-slate-50 h-full rounded-md overflow-auto ">
          <div className="bg-slate-50 rounded-md h-full ">
            <LanguageTable
              defaultCols={defaultCols}
              gridData={gridData}
              setGridData={setGridData}
              cols={cols}
              setCols={setCols}
              numRows={numRows}
              setNumRows={setNumRows}
              handleRowAppend={handleRowAppend}
              setEditedRows={setEditedRows}
              onCellClicked={onCellClicked}
              selection={selection}
              setSelection={setSelection}
              onSearch={onSearch}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      {contextHolder}
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default ManageLanguage;
