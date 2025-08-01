import React from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { useTranslation } from 'react-i18next';
import UsersRegisTable from './UsersRegistTable';
import RolesTable from './RolesTable';

const RolesUsersMaster = ({
  defaultCols,
  gridData,
  setGridData,
  cols,
  setCols,
  numRows,
  setNumRows,
  handleRowAppendRoles,
  setEditedRowsRoles,
  onCellClicked,
  onSearchRoles,
  isLoadingRole,

  defaultColsUsers,
  gridDataUsers,
  setGridDataUsers,
  colsUsers,
  setColsUsers,
  numRowsUsers,
  setNumRowsUsers,
  handleRowAppendUsers,
  setEditedRowsUsers,
  onCellClickedUser,
  selectionUser,
  setSelectionUser,
  onSearchUsers,
  isLoadingUser,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 h-full rounded-md overflow-auto ">
      <div className="bg-slate-50 rounded-md h-full  ">
        <Splitter className="w-full h-full mb-0 pb-0">
          <SplitterPanel size={30} minSize={25}>
            <RolesTable
              defaultCols={defaultCols}
              gridData={gridData}
              setGridData={setGridData}
              cols={cols}
              setCols={setCols}
              numRows={numRows}
              setNumRows={setNumRows}
              handleRowAppend={handleRowAppendRoles}
              setEditedRows={setEditedRowsRoles}
              onCellClicked={onCellClicked}
              onSearch={onSearchRoles}
              isLoading = {isLoadingRole}
            />
          </SplitterPanel>

          <SplitterPanel size={80} minSize={60}>
            <UsersRegisTable
              defaultCols={defaultColsUsers}
              gridData={gridDataUsers}
              setGridData={setGridDataUsers}
              cols={colsUsers}
              setCols={setColsUsers}
              numRows={numRowsUsers}
              setNumRows={setNumRowsUsers}
              handleRowAppend={handleRowAppendUsers}
              setEditedRows={setEditedRowsUsers}
              onCellClicked={onCellClickedUser}
              selection={selectionUser}
              setSelection={setSelectionUser}
              onSearch={onSearchUsers}
              isLoading={isLoadingUser}
            />
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};

export default RolesUsersMaster;