import { RefreshOutlined, UpdateOutlined } from '@mui/icons-material';
import { Button, Typography } from 'antd';
import React from 'react';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const onSearch = (value) => {
  console.log(value);
};

const SysCodeAction = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <Typography.Title level={4} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight:'bold' }}>
        Đăng ký thông tin hệ thống
      </Typography.Title>

      <div className="flex items-center gap-2">
      
        <Button type="primary" icon={<SaveOutlined />}>
          Lưu
        </Button>
        <Button type="primary" icon={<UpdateOutlined />}>
          Sửa
        </Button>
        <Button type="primary" icon={<DeleteOutlined />}>
          Xóa
        </Button>
        <Button type="primary" icon={<RefreshOutlined />}>
          Làm mới
        </Button>
      </div>
    </div>
  );
};

export default SysCodeAction;
