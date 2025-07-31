import { FilterOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip, Typography } from 'antd';
import React from 'react';

const SearchPageAction = ({ titlePage, onSearch, onClickSearch, onClickFilter, keyword, setKeyword, onClickSave }) => {
  return (
    <div className="flex justify-between items-center py-1">
      <Typography.Title level={5} className="!mb-0 uppercase" style={{ color: '#6b7280', fontWeight: 'bold', paddingLeft: '10px' }}>
        {titlePage}
      </Typography.Title>

      <div className="flex items-center gap-2 pr-2">
        <Input placeholder="Search" allowClear onSearch={onSearch} value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ width: 300 }} />
        <Tooltip title="Filter">
          <Button icon={<FilterOutlined />} onClick={onClickFilter} />
        </Tooltip>
        <Button type="text" icon={<SearchOutlined />} onClick={onClickSearch}>
          Search
        </Button>
        <Button type="text" icon={<SaveOutlined style={{ color: '#10b981' }} />} onClick={onClickSave}>
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default SearchPageAction;
