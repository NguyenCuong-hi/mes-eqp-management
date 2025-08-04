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

// ==============================|| ACCOUNT PRODUCT PAGE ||============================== //

const ManageUsers = ({ canCreate }) => {
  const { t } = useTranslation();
  const { notify, contextHolder } = useNotify();
  const { spinning, percent, showLoader, hideLoader } = useFullscreenLoading();
  const [isAPISuccess, setIsAPISuccess] = useState(true);
  const { showConfirm } = useConfirmDialog();
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(false);

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
      title: t('Vai trò'),
      id: 'name',
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
      title: t('Người tạo'),
      id: 'createdBy',
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
      title: t('Ngày tạo'),
      id: 'createDate',
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
      title: t('Ngày chỉnh sửa'),
      id: 'modifyDate',
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
      title: t('Người chỉnh sửa'),
      id: 'modifiedBy',
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
      'S_ERP_COLS_PAGE_ROLES_LIST',
      defaultCols.filter((col) => col.visible)
    )
  );
  const [gridData, setGridData] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [numRowsToAddRoles, setNumRowsToAddRoles] = useState(null);

  const [editedRowsRoles, setEditedRowsRoles] = useState([]);
  const [addedRowsRoles, setAddedRowsRoles] = useState([]);

  const handleRowAppendRoles = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(cols, setGridData, setNumRows, setAddedRowsRoles, numRowsToAdd, setNumRowsToAddRoles);
    },
    [cols, setGridData, setNumRows, setAddedRowsRoles, numRowsToAddRoles]
  );

  const defaultColsUsers = useMemo(() => [
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
      title: t('id'),
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
      title: t('Tên đăng nhập'),
      id: 'username',
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
      title: t('Tên hiển thị'),
      id: 'displayName',
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
      title: t('Email'),
      id: 'email',
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
      title: t('Mật khẩu'),
      id: 'password',
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
      title: t('Ngày tạo'),
      id: 'createDate',
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
      title: t('Người tạo'),
      id: 'createdBy',
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
      title: t('Ngày thay đổi'),
      id: 'modifyDate',
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
      title: t('Người thay đổi'),
      id: 'modifiedBy',
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
      title: t('Tài khoản không hết hạn'),
      id: 'accountNonExpired',
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
      title: t('Tài khoản khóa'),
      id: 'accountNonLocked',
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
      title: t('Đang hoạt động'),
      id: 'active',
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
      title: t('Thay đổi mật khẩu'),
      id: 'changePassword',
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
      title: t('Hết hạn khóa bảo mật'),
      id: 'credentialsNonExpired',
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
      title: t('Đã được tạo'),
      id: 'justCreated',
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
      title: t('Lần cuối đăng nhập không thành công'),
      id: 'lastLoginFalures',
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
      title: t('Lần đăng nhập'),
      id: 'lastLoginTime',
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
      title: t('Tổng đăng nhập lỗi'),
      id: 'totalLoginFailures',
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

  const [colsUsers, setColsUsers] = useState(() =>
    loadFromLocalStorageSheet(
      'S_ERP_COLS_PAGE_USERS_LIST',
      defaultColsUsers.filter((col) => col.visible)
    )
  );
  const [gridDataUsers, setGridDataUsers] = useState([]);
  const [numRowsUsers, setNumRowsUsers] = useState(0);
  const [numRowsToAddUsers, setNumRowsToAddUsers] = useState(null);
  const [addedRowsUsers, setAddedRowsUsers] = useState([]);
  const [editedRowsUsers, setEditedRowsUsers] = useState([]);
  const [roleName, setRoleName] = useState('');

  const handleRowAppendUsers = useCallback(
    (numRowsToAdd) => {
      if (canCreate === false) {
        message.warning('Bạn không có quyền thêm dữ liệu');
        return;
      }
      onRowAppended(colsUsers, setGridDataUsers, setNumRowsUsers, setAddedRowsUsers, numRowsToAdd, numRowsToAddUsers);
    },
    [colsUsers, setGridDataUsers, setNumRowsUsers, setAddedRowsUsers, numRowsToAddUsers]
  );

  const fieldsToTrack = ['Select', 'BizUnitName', 'BizUnit'];

  const { filterValidEntries, findLastEntry, findMissingIds } = useDynamicFilter(gridDataUsers, fieldsToTrack);

  const [count, setCount] = useState(0);
  const lastWordEntryRef = useRef(null);
  const [isSent, setIsSent] = useState(false);

  //   Load
  const fetchData = useCallback(async (keyword) => {
    if (!isAPISuccess) return;
    setIsAPISuccess(false);
    try {
      const data = [
        {
          pageIndex: 1,
          pageSize: 50,
          keywork: keyword || ''
        }
      ];

      const response = await SearchBy(data);
      const fetchedData = response.data || [];
      setGridData(fetchedData);
      setNumRows(fetchedData.length);
    } catch (error) {
      setGridData([]);
      setNumRows(0);
    } finally {
      setIsAPISuccess(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  //   Action
  const onClickSave = useCallback(async () => {
    showLoader();
    const requiredColumns = ['userName',];

    const commonColumnsRoles = ['id', 'name', 'createdBy', 'createdDate', 'modifiedDate', 'modifiedBy'];

    const commonColumns = [
      'id',
      'username',
      'displayName',
      'email',
      'password',
      'createdDate',
      'createdBy',
      'modifiedDate',
      'modifiedBy',
      'accountNonExpired',
      'accountNonLocked',
      'active',
      'credentialsNonExpired',
      'justCreated',
      'lastLoginFalures',
      'lastLoginTime',
      'totalLoginFailures'
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

    const resulU = filterAndSelectColumns(gridDataUsers, commonColumns, 'U');
    const resulA = filterAndSelectColumns(gridDataUsers, commonColumns, 'A');

    const resulURoles = filterAndSelectColumns(gridData, commonColumnsRoles, 'U');
    const resulARoles = filterAndSelectColumns(gridData, commonColumnsRoles, 'A');
    const validationMessage = validateCheckColumns([...resulU, ...resulA], [...commonColumns, ...commonColumns], requiredColumns);

    const usersNew = resulA.map((item) => {
      return {
        ...item,
        roles: [clickedRowData.name],
        confirmPassword: item.password,
        userAuthorities: ['USER.CREATE']
      };
    });

    const usersEdit = resulU.map((item) => {
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

    const dataRoles = [...resulURoles, ...resulARoles];
    const dataUser = [...usersNew, ...usersEdit];

    try {
      const promises = [];

      if (dataRoles.length > 0) promises.push(CreateRoleByService(dataRoles));
      if (dataUser.length > 0) promises.push(CreateByService(dataUser));

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        if (result?.success && result?.data) {
          setEditedRowsUsers([]);
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
  const [rows, setRows] = useState([]);

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
    setGridDataUsers(dataAddStatus);
    setNumRowsUsers(dataAddStatus.length);

    return false;
  };

  const [isMinusClicked, setIsMinusClicked] = useState(false);
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [clickedRowData, setClickedRowData] = useState(null);

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

      if (rowIndex >= 0 && rowIndex < gridData.length) {
        const rowData = gridData[rowIndex];

        const data = {
          roleCode: rowData.name,
          page: 0,
          size: 10
        };
        fetchUserByRoles(data);
        setClickedRowData(rowData);
      }
    },
    [gridData, gridDataUsers]
  );

  const fetchUserByRoles = async (data) => {
    setIsLoadingUser(true);
    try {
      const result = await getUserByRole(data);
      if (result?.success && result?.data) {
        setGridDataUsers(result?.data);
        setNumRowsUsers(result?.data.length);
        setIsLoadingUser(false);
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
      setIsLoadingUser(false);
    }
  };

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

            if (product.UMQCTitleSeq) {
              product['Status'] = 'U';
            } else {
              product['Status'] = 'A';
            }

            setEditedRowsRoles((prevEditedRows) => updateEditedRows(prevEditedRows, product, newData, ''));

            return newData;
          });
        }
      }
    });

    return rows;
  };

  const [isMinusClickedUser, setIsMinusClickedUser] = useState(false);
  const [lastClickedCellUser, setLastClickedCellUser] = useState(null);
  const [clickedRowDataUser, setClickedRowDataUser] = useState(null);
  const [selectedUser, setSelectUser] = useState([]);
  const [selectedRoles, setSelectRoles] = useState([]);

  const [selectionUser, setSelectionUser] = useState({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty()
  });

  const onCellClickedUser = useCallback(
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

      if (rowIndex >= 0 && rowIndex < gridDataUsers.length) {
        setSelectUser(getSelectedRowsUsers());
      }
    },
    [gridDataUsers, selectedUser, selectionUser]
  );

  const getSelectedRowsUsers = () => {
    const selectedRows = selectionUser.rows.items;
    let rows = [];
    selectedRows.forEach((range) => {
      const start = range[0];
      const end = range[1] - 1;

      for (let i = start; i <= end; i++) {
        if (gridData[i]) {
          rows.push(gridDataUsers[i]);

          setGridDataUsers((prev) => {
            const newData = [...prev];
            const product = gridDataUsers[i];

            if (product.id) {
              product['Status'] = 'U';
            } else {
              product['Status'] = 'A';
            }

            setEditedRowsUsers((prevEditedRows) => updateEditedRows(prevEditedRows, product, newData, ''));

            return newData;
          });
        }
      }
    });

    return rows;
  };

  const handleDelete = useCallback(async () => {

    if (selectedUser.length === 0) {
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
      const ids = selectedUser.map((item) => item.id).filter((id) => id !== undefined);
      if (selectedUser.length > 0) promises.push(DeleteUserByService(ids));

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
  }, [selectedUser, clickedRowData]);

   const onClickDelete = useCallback(() => {
     showConfirm({
       title: 'Xác nhận xóa bản ghi?',
       content: '',
       onOk: async () => {
         return handleDelete();
       }
     });
   }, [selectedUser]);

   const debounceSearchUser = useMemo(() => 
    debounce((value, roleCode) => {
      if (value.trim()) {
        const data = {
          roleCode: roleCode,
          keyword: value,
          page: 0,
          size: 10,
        };
        fetchUserByRoles(data);
      }
    }, 500)
  , []);

   const debounceSearchRole = useMemo(() => 
    debounce((value) => {
      if (value.trim()) {
        const data = {
          keyword: value,
          page: 0,
          size: 10,
        };
        fetchData(data);
      }
    }, 500)
  , []);

   const onSearchRoles = useCallback((value) => {
     const keyword = value.target.value;
       debounceSearchRole(keyword);
   }, []);

   const onSearchUsers = useCallback(
     (value) => {
      const keyword = value.target.value;
       debounceSearchUser(keyword, clickedRowData.name);
     },
     [clickedRowData]
   );

  return (
    <>
      <div className="h-full pt-4">
        <UsersAction title={'Đăng ký tài khoản'} onClickSave={onClickSave} onClickDelete={onClickDelete} onClickImport={onClickImport} />
        <RolesUsersMaster
          defaultCols={defaultCols}
          cols={cols}
          setCols={setCols}
          gridData={gridData}
          setGridData={setGridData}
          numRows={numRows}
          setNumRows={setNumRows}
          handleRowAppendRoles={handleRowAppendRoles}
          setEditedRowsRoles={setEditedRowsRoles}
          onCellClicked={onCellClicked}
          onSearchRoles={onSearchRoles}
          defaultColsUsers={defaultColsUsers}
          gridDataUsers={gridDataUsers}
          setGridDataUsers={setGridDataUsers}
          colsUsers={colsUsers}
          setColsUsers={setColsUsers}
          numRowsUsers={numRowsUsers}
          setNumRowsUsers={setNumRowsUsers}
          selectionUser={selectionUser}
          setSelectionUser={setSelectionUser}
          handleRowAppendUsers={handleRowAppendUsers}
          setEditedRowsUsers={setEditedRowsUsers}
          onCellClickedUser={onCellClickedUser}
          onSearchUsers={onSearchUsers}
          isLoadingRole={isLoadingRole}
          isLoadingUser={isLoadingUser}
        />
      </div>
      {contextHolder}
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default ManageUsers;
