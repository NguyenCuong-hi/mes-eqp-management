import React from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';

import EventTable from '../table/EventTable';
import EquipmentEventsTable from '../table/EquipmentEventsTable';

const EquipmentEventsQuery = ({
  defaultColsEvent,
  gridDataEvent,
  setGridDataEvent,
  colsEvent,
  setColsEvent,
  numRowsEvent,
  setNumRowsEvent,

  defaultColsEqpEvent,
  gridDataEqpEvent,
  setGridDataEqpEvent,
  colsEqpEvent,
  setColsEqpEvent,
  numRowsEqpEvent,
  setNumRowsEqpEvent
}) => {
  const { t } = useTranslation();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <div className="bg-slate-50 rounded-md overflow-auto mb-2">
      <Typography.Title className="border-b-1 uppercase border-gray-400 m-2" style={{ fontSize: 'medium', color: '#6b7280' }}>
        Đăng ký thông tin trạng thái thiết bị
      </Typography.Title>
      <div className="bg-slate-50 rounded-md h-[500px]  ">
        <Splitter className="w-full h-full mb-0 pb-0">
          <SplitterPanel size={45} minSize={10}>
            <EventTable
              defaultCols={defaultColsEvent}
              gridData={gridDataEvent}
              setGridData={setGridDataEvent}
              cols={colsEvent}
              setCols={setColsEvent}
              numRows={numRowsEvent}
              setNumRows={setNumRowsEvent}
            />
          </SplitterPanel>

          <SplitterPanel size={55} minSize={10}>
            <EquipmentEventsTable
              defaultCols={defaultColsEqpEvent}
              gridData={gridDataEqpEvent}
              setGridData={setGridDataEqpEvent}
              cols={colsEqpEvent}
              setCols={setColsEqpEvent}
              numRows={numRowsEqpEvent}
              setNumRows={setNumRowsEqpEvent}
            />
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};

export default EquipmentEventsQuery;
