import { Button, Input, Typography, Upload } from 'antd';
import React from 'react';
import { DeleteOutlined, SaveOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';

const onSearch = (value) => {
  console.log(value);
};

const MenuAuthorAction = ({ title, keyword, onClickSearch,  onClickSave, onClickUpdate, onClickDelete, onClickImport }) => {
  return (
    <div className="flex justify-between items-center py-1">
      <Typography.Title level={5} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight: 'bold', paddingLeft: '10px' }}>
        {title}
      </Typography.Title>

      <div className="flex items-center gap-2 pr-2">
      <Input placeholder="Search" allowClear onSearch={onSearch} value={keyword} style={{ width: 300 }} />
        
      <Button type="text" icon={<SearchOutlined />} onClick={onClickSearch}>
          Search
        </Button>
        
        <Button type='text' icon={<SaveOutlined style={{ color: '#10b981' }} />} onClick={onClickSave}>
          Lưu
        </Button>

        <Button type='text' icon={<DeleteOutlined style={{ color: '#ef4444' }} />} onClick={onClickDelete}>
          Xóa
        </Button>
        <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={onClickImport}>
          <Button type='text'  icon={<UploadOutlined style={{  color: '#3b82f6'  }} />}>
            Import
          </Button>
        </Upload>
      </div>
    </div>
  );
};

export default MenuAuthorAction;
