import { Approval, Description, Label, Note } from '@mui/icons-material';
import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Typography } from 'antd';
import React from 'react';

const MachineInfomationQuery = ({ formDataBasic, onFinish }) => {
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  return (
    <div className="bg-slate-50 rounded-md overflow-auto mb-2">
      <Typography.Title className="border-b-1 uppercase border-gray-400 m-2" style={{ fontSize: 'medium', color: '#6b7280' }}>
        Đăng ký thông tin cơ bản
      </Typography.Title>
      <Form form={formDataBasic} onFinish={onFinish} layout="vertical">
        <Row className="gap-3 flex items-center m-2 ">
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Mã thiết bị</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'EquipmentCode'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên thiết bị</span>}
              style={{ marginBottom: 0, width: 400 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'EquipmentName'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Mô tả</span>}
              style={{ marginBottom: 0, width: 400 }}
              labelCol={{ style: { marginBottom: 2, padding: 0, } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'Description'}
            >
              <Input placeholder="" className="w-[300px]" size="middle" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default MachineInfomationQuery;
