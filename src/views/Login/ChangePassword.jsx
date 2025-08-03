
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ChangePassword = ({ }) => {
  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    try {
      // Gọi API đổi mật khẩu tại đây
      // await ChangePasswordService(values);
      message.success('Đổi mật khẩu thành công!');
      resetForm();
      onCancel(); // đóng modal
    } catch (error) {
      message.error('Đổi mật khẩu thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  return (

      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
          newPassword: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu mới'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
            .required('Vui lòng xác nhận mật khẩu')
        })}
        onSubmit={handleChangePassword}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, errors, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Mật khẩu cũ"
              validateStatus={touched.oldPassword && errors.oldPassword ? 'error' : ''}
              help={touched.oldPassword && errors.oldPassword}
            >
              <Input.Password
                name="oldPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.oldPassword}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              validateStatus={touched.newPassword && errors.newPassword ? 'error' : ''}
              help={touched.newPassword && errors.newPassword}
            >
              <Input.Password
                name="newPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.newPassword}
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              validateStatus={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
              help={touched.confirmPassword && errors.confirmPassword}
            >
              <Input.Password
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isSubmitting}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
  );
};

export default ChangePassword;
