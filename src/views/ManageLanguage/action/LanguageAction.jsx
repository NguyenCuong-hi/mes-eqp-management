import { DeleteOutlined, FilterOutlined, LoadingOutlined, SaveOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip, Typography, Upload } from 'antd';
import React from 'react';

const LanguageAction = ({ titlePage, onSearch, onClickSearch, onClickFilter, onClickImport, onClickDelete, keyword, setKeyword, onClickSave, isLoading}) => {
  return (
    <div className="flex justify-between items-center py-1">
      <Typography.Title level={5} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight: 'bold', paddingLeft: '10px' }}>
        {titlePage}
      </Typography.Title>

      <div className="flex items-center gap-2 pr-2">
        <Input
          placeholder="Search"
          allowClear
          onSearch={onSearch}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 300 }}
          suffix={isLoading ? <LoadingOutlined className="animate-spin" /> : <SearchOutlined />}
        />
        <Tooltip title="Filter">
          <Button icon={<FilterOutlined />} onClick={onClickFilter} />
        </Tooltip>
        <Button type="text" icon={<SearchOutlined />} onClick={onClickSearch}>
          Search
        </Button>
        <Button type="text" icon={<SaveOutlined style={{ color: '#10b981' }} />} onClick={onClickSave}>
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

export default LanguageAction;
