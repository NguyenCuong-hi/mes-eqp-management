
import { notification } from 'antd';
import { useCallback } from 'react';

export const useNotify = () => {
  const [api, contextHolder] = notification.useNotification();

  const notify = useCallback(({ message, description, type = 'info', duration = 3, placement = 'top' }) => {
    api[type]({
      message,
      description,
      duration,
      placement,
    });
  }, [api]);

  return { notify, contextHolder };
};
