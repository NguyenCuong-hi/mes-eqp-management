import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import BG from '../../../src/assets/images/logo.svg';

const LoadingBlur = () => {
  return (
    <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
      <img src={BG} alt="Loading" className="w-32 opacity-60 mb-4" />
      <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
    </div>
  );
};

export default LoadingBlur;
