import { notification } from 'antd';
import { useEffect } from 'react';

const NotificationMessage = ({
  message,
  description,
  type = 'info',
  duration = 3,
  trigger = false,
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (trigger) {
      const uniqueKey = `${Date.now()}-${Math.random()}`;

      api[type]({
        message,
        description,
        duration,
        key: uniqueKey,
        placement: 'top',
      });
    }
  }, [trigger]);

  return <>{contextHolder}</>;
};

export default NotificationMessage;
