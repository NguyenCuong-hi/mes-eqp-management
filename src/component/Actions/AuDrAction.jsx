import { RefreshOutlined, UpdateOutlined } from '@mui/icons-material';
import { Button, Typography } from 'antd';
import React from 'react';
import { DeleteOutlined, SaveOutlined, SwitcherFilled, SwitcherOutlined } from '@ant-design/icons';

const onSearch = (value) => {
  console.log(value);
};

const AuDrAction = ({

  onClickSave,
  onClickUpdate,
  onClickDelete,
  onClickReset,
  titlePage,

}) => {
  return (
    <div className="flex justify-between items-center py-1">
      <Typography.Title level={5} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight: 'bold', paddingLeft: '10px' }}>
        {titlePage}
      </Typography.Title>

      <div className="flex items-center gap-2">

        <Button
          type="text"
          icon={<SaveOutlined style={{ color: '#10b981' }}/>}
          onClick={onClickSave}
        >
          Lưu
        </Button>

        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
          onClick={onClickDelete}>
          Xóa
        </Button>
        <Button
          type="text"
          icon={<SwitcherOutlined />}
          onClick={onClickReset}>
          Sao chép
        </Button>
      </div>
    </div>


  );
};

export default AuDrAction;
