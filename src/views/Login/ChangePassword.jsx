
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ChangeNewPassword } from 'services/Auth/ChangeNewPassword';
import { useNotify } from 'utils/hooks/onNotify';
import { useTranslation } from 'react-i18next';

const ChangePassword = ({ handleLoginSuccess }) => {
  const { notify, contextHolder } = useNotify();
  const { t } = useTranslation();

    const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
      try {
        await ChangeNewPassword(values);
        notify({
            type: 'success',
            message: 'Thành công',
            description: t('22')
          });
        resetForm();
        handleLoginSuccess();
      } catch (error) {
        console.error(error);
        notify({
            type: 'error',
            message: 'Thất bại',
            description: t('23')
          });
      } finally {
        setSubmitting(false);
      }
    };

  return (

      <Formik
        initialValues={{
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
          password: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu mới'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
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
              validateStatus={touched.password && errors.password ? 'error' : ''}
              help={touched.password && errors.password}
            >
              <Input.Password
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
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
