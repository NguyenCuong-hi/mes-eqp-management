import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const useConfirmDialog = () => {
  const showConfirm = (options = {}) => {
    const {
      title = 'Are you sure?',
      content = '',
      icon = null,
      onOk,
      onCancel,
    } = options;

    confirm({
      title,
      icon,
      content,
      onOk: () => {
        const result = onOk?.();
        if (result instanceof Promise) {
          return result.catch(() => {
            console.log('Oops errors!');
          });
        }
        return result;
      },
      onCancel,
    });
  };

  return { showConfirm };
};

export default useConfirmDialog;