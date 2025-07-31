import { Col, DatePicker, Form, Input, Radio, Row, Select, Typography } from 'antd';
import React from 'react';

const ModelInfomationQuery = ({ formModelBasic, dataL, dataM, dataS, dataCustomer, dataStatus, onFinish }) => {

  const onChangeModelTypeL = (value) => {
    if (value !== undefined) {
      const modelTypeL = dataL.find((x) => x.value === value);
      formModelBasic.setFieldsValue({
        modelTypeL: modelTypeL.value,
        modelTypeLName: modelTypeL.label
      });
    }
  };

  const onChangeModelTypeM = (value) => {
    if (value !== undefined) {
      const modelTypeM = dataM.find((x) => x.value === value);
      formModelBasic.setFieldsValue({
        modelTypeM: modelTypeM.value,
        modelTypeMName: modelTypeM.label
      });
    }
  };

  const onChangeModelTypeS = (value) => {
    if (value !== undefined) {
      const modelTypeS = dataS.find((x) => x.value === value);
      formModelBasic.setFieldsValue({
        modelTypeS: modelTypeS.value,
        modelTypeSName: modelTypeS.label
      });
    }
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const onChangeStatus = (value) => {
    if (value !== undefined) {
      const status = dataStatus.find((x) => x.value === value);
      formModelBasic.setFieldsValue({
        statusConfProd: status,

      });
    }
  };

  const onChangeCustomer = (value) => {
    if (value !== undefined) {
      const customer = dataCustomer.find((x) => x.value === value);
      formModelBasic.setFieldsValue({
        customer: customer,
      });
    }
  };

  return (
    <div className="bg-slate-50 ">
      <Form form={formModelBasic} onFinish={onFinish} layout="vertical">
        <Row className="gap-3 flex items-center ml-2">
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Tên cấu hình sản phẩm</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'configProdName'}
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
              label={<span className="uppercase text-[9px]">Mô tả</span>}
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
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Ghi chú</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'approval'}
            >
              <Input
                placeholder=""
                className="w-[150px]"
                size="middle"
                // value={Note}
                // onChange={(e) => setNote(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              name={'approval'}
              label={<span className="uppercase text-[9px]">Chấp nhận</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Trạng thái</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'statusConfProd'}
            >
              <Select
                showSearch
                placeholder="Trạng thái"
                optionFilterProp="label"
                onChange={onChangeStatus}
                onSearch={onSearch}
                allowClear
                options={dataStatus}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Khách hàng</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'customer'}
            >
              <Select
                showSearch
                placeholder="Khách hàng"
                optionFilterProp="customer"
                onChange={onChangeCustomer}
                onSearch={onSearch}
                allowClear
                options={dataCustomer}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Người đăng ký</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'userRegister'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Hạn dùng</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'dateExpire'}
            >
              <DatePicker
                // value={DatePeriod}
                // onChange={(date, dateString) => setDatePeriod(dateString)}
                format="YYYY-MM-DD"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="gap-3 flex items-center m-2 ">
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Loại sản phẩm L</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'modelTypeLName'}
            >
              <Select
                showSearch
                placeholder="Loại sản phẩm"
                optionFilterProp="label"
                onChange={onChangeModelTypeL}
                onSearch={onSearch}
                allowClear
                options={dataL}
              />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Loại sản phẩm M</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'modelTypeMName'}
            >
              <Select
                showSearch
                placeholder="Loại sản phẩm "
                optionFilterProp="label"
                onChange={onChangeModelTypeM}
                onSearch={onSearch}
                allowClear
                options={dataM}
              />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Loại sản phẩm S</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'modelTypeSName'}
            >
              <Select
                showSearch
                placeholder="Loại sản phẩm"
                optionFilterProp="label"
                onChange={onChangeModelTypeS}
                onSearch={onSearch}
                allowClear
                options={dataS}
              />
            </Form.Item>
          </Col>

          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Nhãn hiệu</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'label'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Thiết bị khách hàng</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'deviceCustomer'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Dự án</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'projectName'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} md={{ flex: '40%' }} lg={{ flex: '20%' }} xl={{ flex: '10%' }}>
            <Form.Item
              label={<span className="uppercase text-[9px]">Người nhận hàng</span>}
              style={{ marginBottom: 0 }}
              labelCol={{ style: { marginBottom: 2, padding: 0 } }}
              wrapperCol={{ style: { padding: 0 } }}
              name={'consignee'}
            >
              <Input placeholder="" className="w-[150px]" size="middle" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ModelInfomationQuery;
