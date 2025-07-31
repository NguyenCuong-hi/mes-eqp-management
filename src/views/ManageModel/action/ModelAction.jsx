import { SearchOutlined } from '@mui/icons-material';
import { Button, Input, Tooltip, Typography } from 'antd';
import React from 'react';
import { FilterOutlined } from '@ant-design/icons';

const onSearch = (value) => {
  console.log(value);
};

const ModelAction = () => {
  return (
    <div className="flex justify-between items-center py-4">
      <Typography.Title level={4} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight:'bold' }}>
        Danh sách dòng sản phẩm
      </Typography.Title>

      <div className="flex items-center gap-2">
        <Input.Search
          placeholder="Search"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
        <Tooltip title="Filter">
          <Button type="primary" icon={<FilterOutlined />} />
        </Tooltip>
        <Button type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default ModelAction;
