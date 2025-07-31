import React, { useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useTranslation } from 'react-i18next';
import RolesTable from './RolesTable';
import { Input, Menu } from 'antd';
import { MonitorOutlined } from '@ant-design/icons';
import MenuRegistTable from './MenuRegistTable';
import AuthorityRegistTable from './AuthorityRegistTable';

const RoleMenuMaster = ({
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

  defaultcolsMenu,
  gridDataMenu,
  setGridDataMenu,
  colsMenu,
  setColsMenu,
  numRowsMenu,
  setNumRowsMenu,
  handleRowAppendMenu,
  setEditedRowsMenu,
  onCellClickedMenu,
  selectionMenu,
  setSelectionMenu,

  defaultColsAuthor,
  gridDataAuthor,
  setGridDataAuthor,
  colsAuthor,
  setColsAuthor,
  numRowsAuthor,
  setNumRowsAuthor,
  handleRowAppendAuthor,
  setEditedRowsAuthor,
  onCellClickedAuthor
}) => {
  const { t } = useTranslation();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const [checkPageA, setCheckPageA] = useState(false);
  const [current, setCurrent] = useState('1');

  return (
    <div className="bg-slate-50 h-full rounded-md overflow-auto ">
      <div className="bg-slate-50 rounded-md h-full ">
        <Splitter className="w-full h-full ">
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
            />
          </SplitterPanel>

          <SplitterPanel size={80} minSize={60}>
            <div className="h-full flex flex-col">
              <div className=" border">
                <Menu
                  mode="horizontal"
                  selectedKeys={[current]}
                  onClick={(e) => {
                    if (!checkPageA) {
                      setCurrent(e.key);
                    } else {
                      message.warning(t('870000042'));
                    }
                  }}
                  items={[
                    {
                      key: '1',
                      label: (
                        <span className="flex items-center gap-1">
                          <MonitorOutlined size={14} />
                          {t('Menu')}
                        </span>
                      )
                    },
                    {
                      key: '2',
                      label: (
                        <span className="flex items-center gap-1">
                          <MonitorOutlined size={14} />
                          {t('Phân quyền')}
                        </span>
                      )
                    }
                  ]}
                />
           
                
              </div>

              {current === '1' && (
                <MenuRegistTable
                  defaultCols={defaultcolsMenu}
                  gridData={gridDataMenu}
                  setGridData={setGridDataMenu}
                  cols={colsMenu}
                  setCols={setColsMenu}
                  numRows={numRowsMenu}
                  setNumRows={setNumRowsMenu}
                  handleRowAppend={handleRowAppendMenu}
                  setEditedRows={setEditedRowsMenu}
                  onCellClicked={onCellClickedMenu}
                  selection={selectionMenu}
                  setSelection={setSelectionMenu}
                />
              )}
              {current === '2' && (
                <AuthorityRegistTable
                  defaultCols={defaultColsAuthor}
                  gridData={gridDataAuthor}
                  setGridData={setGridDataAuthor}
                  cols={colsAuthor}
                  setCols={setColsAuthor}
                  numRows={numRowsAuthor}
                  setNumRows={setNumRowsAuthor}
                  handleRowAppend={handleRowAppendAuthor}
                  setEditedRows={setEditedRowsAuthor}
                  onCellClicked={onCellClickedAuthor}
                />
              )}
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};

export default RoleMenuMaster;
