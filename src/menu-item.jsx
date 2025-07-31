import {
  HomeOutlined,
  ProductFilled,
  SettingOutlined,
} from '@ant-design/icons';
import { FactoryOutlined, LineAxis, OutboxOutlined } from '@mui/icons-material';

const menuItems = [
  
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Dashboard'
  },
  {
    key: 'model',
    icon: <ProductFilled />,
    label: 'Cấu hình sản phẩm sản xuất',
    children: [
      { key: 'mng-model', label: 'Danh sách cấu hình sản phẩm', component: "ManageModelPage", permission: null, },
      { key: 'model-register', label: 'Đăng ký cấu hình sản phẩm', component: "ManageModelPageDetails", permission: null, },
    ]
  },
  {
    key: 'manage-process-line',
    icon: <LineAxis />,
    label: 'Quản lý quy trình',
    children: [
      { key: 'list-process-line', label: 'Danh sách quy trình', component: "ManageRouteSetPage", permission: null, },
      { key: 'process-line-register', label: 'Đăng ký thông tin quy trình', component: "ManageRouteSetDetails", permission: null, },
    ]
  },
  {
    key: 'manage-operation',
    icon: <LineAxis />,
    label: 'Quản lý công đoạn',
    children: [
      { key: 'list-process', label: 'Danh sách công đoạn', component: "ManageOperation", permission: null, },
      { key: 'process-register', label: 'Đăng ký thông tin công đoạn', component: "ManageOperationDetails", permission: null, },
    ]
  },
  {
    key: 'manage-machine',
    icon: <OutboxOutlined />,
    label: 'Quản lý thiết bị',
    children: [
      { key: 'list-machine', label: 'Danh sách thiết bị', component: "ManageMachinePage", permission: null, },
      { key: 'machine-register', label: 'Đăng ký thiết bị', component: "ManageMachineDetails", permission: null, },
      { key: 'machine-event', label: 'Đăng ký sự kiện thiết bị' },
      { key: 'machine-event-setting', label: 'Cấu hình sự kiện thiết bị' },
    ]
  },
  {
    key: 'manage-accessory',
    icon: <OutboxOutlined />,
    label: 'Quản lý phụ kiện',
    children: [
      { key: 'list-accessory', label: 'Danh sách phụ kiện' },
      { key: 'accessory-register', label: 'Đăng ký phụ kiện' },
    ]
  },
  {
    key: 'manage-interlock',
    icon: <OutboxOutlined />,
    label: 'Quản lý Interlock',
    children: [
      { key: 'list-interlock', label: 'Danh sách Interlock' },
      { key: 'interlock-register', label: 'Đăng ký Interlock' },
    ]
  },
  {
    key: 'system',
    icon: <FactoryOutlined />,
    label: 'Hệ thống sản xuất',
    children: [
      { key: 'system-manuf-code', label: 'Đăng ký thông tin hệ thống', component: "ManageCodeSys", permission: null, },
      { key: 'system-manuf-param', label: 'Đăng ký bổ sung' },
    ]
  },
  {
    key: 'program',
    icon: <SettingOutlined />,
    label: 'Cấu hình hệ thống',
    children: [
      { key: 'system-menu', label: 'Cài đặt menu', component: "ManageMenu", permission: null, },
      { key: 'system-users', label: 'Cài đặt tài khoản', component: "ManageUsers", permission: null, },
    ]
  }

];

export default menuItems;
