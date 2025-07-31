import React, { useState } from 'react';
import { Button, Divider, Form, Input, Select, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addTab, setActiveTab } from 'store/tabsReducer';
import LoadingBlur from 'component/Loader/LoadingBlur';
import { AuthLoginService } from 'services/Auth/GetTokenService';
import Cookies from 'js-cookie'
import { GetUserService } from 'services/Auth/GetUserService';

const AuthLogin = ({ setIsLoggedIn, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [logInFailMessage, setLogInFailMessage] = useState('');

  const [language, setLanguage] = useState(() => {
    return parseInt(localStorage.getItem('language'), 10) || 6;
  });

  const dispatch = useDispatch();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    dispatch(addTab({
      key: "home",
      label: "Trang chủ",
      component: "DashboardDefault",
      permission: null,
    }));
    dispatch(setActiveTab('home'));
    setLoadingView(true);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const data = {
        username: values.username,
        password: values.password,
      }

      const loginResponse = await AuthLoginService(data);

      if (loginResponse.success) {
        Cookies.set('token', loginResponse.data.access_token)
        const user = await GetUserService();
        localStorage.setItem('username', JSON.stringify(user.data.data.username))
        localStorage.setItem('role', JSON.stringify(user.data.data.roles))
        localStorage.setItem('menu-item', JSON.stringify(user.data.data.menuItems))
        setLoading(false);
        setSubmitting(false);
        handleLoginSuccess();
      } else {
        setLogInFailMessage('Sai thông tin tài khoản hoặc mật khẩu đăng nhập !');
        setLoading(false);
        setSubmitting(false);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSubmitting(false);
      setLoadingView(false);
    }
  }

  
  const handleLanguageChange = (value) => {
    setLanguage(value)
    localStorage.setItem('language', value)
  }

  if (loadingView) {
    return <LoadingBlur />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Typography.Title level={2} className="!mb-0">
            Welcome Back
          </Typography.Title>
          <Typography.Text type="secondary">Please login to your account</Typography.Text>
        </div>

        <Formik
          initialValues={{
            username: '',
            password: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().max(255).required('Email is required'),
            password: Yup.string().max(255).required('Password is required')
          })}
          onSubmit={onSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Form layout="vertical" onFinish={handleSubmit} {...rest}>
              <Form.Item
                label="Username"
                validateStatus={touched.username && errors.username ? 'error' : ''}
                help={touched.username && errors.username}
              >
                <Input
                  name="username"
                  placeholder="Enter your email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={touched.password && errors.password ? 'error' : ''}
                help={touched.password && errors.password}
              >
                <Input.Password
                  name="password"
                  placeholder="Enter your password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  size="large"
                />
              </Form.Item>

              {logInFailMessage && (
                <div className="flex justify-center w-full">
                  <Typography.Text type="danger" italic>
                    {logInFailMessage}
                  </Typography.Text>
                </div>
              )}

              <Form.Item label="Language" name="language">
                <Select
                  name="language"
                  value={language}
                  onChange={handleLanguageChange}
                  size="large"
                  options={[
                    { value: 1, label: 'Vietnamese' },
                    { value: 2, label: 'English' },
                    { value: 3, label: 'Korean' },
                  ]}
                >
                  
                </Select>
              </Form.Item>

              {logInFailMessage && (
                <div className="flex justify-center w-full">
                  <Typography.Text type="danger" italic>
                    {logInFailMessage}
                  </Typography.Text>
                </div>
              )}
              {/* 
              <div className="flex justify-end mb-4">
                <Typography.Link>Forgot Password?</Typography.Link>
              </div> */}

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting || loading} className="!rounded-lg">
                  Log In
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthLogin;
