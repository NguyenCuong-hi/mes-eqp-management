import { Col, DatePicker, Form, Input, Radio, Row, Select, Typography } from 'antd';
import React from 'react';

const OperationManageInfo = ({ formBasic, dataUnit, dataStep, dataLossTable, dataSuccessTable, dataReworkTable,  }) => {
  const onChangeDataStep = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeSuccessTable = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeLossTable = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeUnitQty = (value) => {
    console.log(`selected ${value}`);
  }

  return (
    <div className="bg-slate-50 ">
      <Form form={formBasic} layout="vertical">
        <Row className="gap-3 flex items-center ml-2 justify-around">
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[200px]">Đơn vị cơ bản</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'unitQty'}
            >
              <Select
                showSearch
                placeholder="Đơn vị"
                optionFilterProp="label"
                onChange={onChangeUnitQty}
                allowClear
                options={dataUnit}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[200px]">Bước thao tác</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'step'}
            >
              <Select
                showSearch
                placeholder="Trạng thái"
                optionFilterProp="label"
                onChange={onChangeDataStep}
                allowClear
                options={dataStep}
              />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[200px]">Mã lỗi</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'lossTable'}
            >
              <Select
                showSearch
                placeholder="Mã lỗi"
                optionFilterProp="label"
                onChange={onChangeLossTable}
                allowClear
                options={dataLossTable}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px] w-[200px]">Mã hoàn thành</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'successTable'}
            >
              <Select
                showSearch
                placeholder="Mã hoàn thành"
                optionFilterProp="label"
                onChange={onChangeSuccessTable}
                allowClear
                options={dataSuccessTable}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OperationManageInfo;
