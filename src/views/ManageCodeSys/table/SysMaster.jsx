import React, { useMemo, useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { GridColumnIcon } from '@glideapps/glide-data-grid';
import { useTranslation } from 'react-i18next';
import { loadFromLocalStorageSheet } from 'utils/local-storage/column';
import { Typography } from 'antd';
import CodeSysTable from './CodeSysTable';
import CodeSysRegisTable from './CodeSysRegistTable';

const SysMaster = () => {
    const { t } = useTranslation();

    const onChange = value => {
        console.log(`selected ${value}`);
    };
    const onSearch = value => {
        console.log('search:', value);
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
            title: t('CODE'),
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
            title: t('Mô tả'),
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
            title: t('Ghi chú'),
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


    const defaultColsModels = useMemo(() => [
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
            title: t('Code'),
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
            title: t('Name'),
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
            title: t('Group 1'),
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
            title: t('Group 2'),
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
            title: t('Group 3'),
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

    const [colsModels, setColsModels] = useState(() =>
        loadFromLocalStorageSheet(
            'S_ERP_COLS_PAGE_IQC_OUTSOURCE_STATUS_LIST',
            defaultColsModels.filter((col) => col.visible)
        )
    );
    const [gridDataModels, setGridDataModels] = useState([]);
    const [numRowsModels, setNumRowsModels] = useState(0);


    return (
        <div className="bg-slate-50 h-full rounded-md overflow-auto ">
            
            <div className="bg-slate-50 rounded-md h-full  ">

                <Splitter className="w-full h-full mb-0 pb-0">
                    <SplitterPanel size={30} minSize={25}>
                        <CodeSysTable
                            defaultCols={defaultCols}
                            gridData={gridData}
                            setGridData={setGridData}
                            cols={cols}
                            setCols={setCols}
                            numRows={numRows}
                            setNumRows={setNumRows}
                        />
                    </SplitterPanel>

                    <SplitterPanel size={80} minSize={60}>
                        <CodeSysRegisTable
                            defaultCols={defaultColsModels}
                            gridData={gridDataModels}
                            setGridData={setGridDataModels}
                            cols={colsModels}
                            setCols={setColsModels}
                            numRows={numRowsModels}
                            setNumRows={setNumRowsModels}
                        />
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>



    );
};

export default SysMaster;