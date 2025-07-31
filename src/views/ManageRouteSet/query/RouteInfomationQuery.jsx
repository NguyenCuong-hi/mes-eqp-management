import { Col, DatePicker, Form, Input, Radio, Row, Select, Typography } from 'antd';
import React from 'react';

const RouteInfomationQuery = ({ formBasic, }) => {


  return (
    <div className="bg-slate-50 ">
      <Form form={formBasic} layout="vertical">
        <Row className="gap-3 flex items-center ml-2">
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[300px]">Tên quy trình sản xuất</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'routeName'}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                // value={ConfigProductName}
                // onChange={(e) => setConfigProductName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[300px]">Mã quy trình sản xuất</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'routeCode'}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                // value={ConfigProductName}
                // onChange={(e) => setConfigProductName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[300px]">Mô tả</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'description'}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                // value={Description}
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </Col>
          
        </Row>
      </Form>
    </div>
  );
};

export default RouteInfomationQuery;
