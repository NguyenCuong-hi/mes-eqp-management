import axios from 'axios';
import { HOST_API_SERVER } from 'services/config';
import { ERROR_MESSAGES } from 'utils/constans/sysConstans';
import { accessToken } from 'utils/cookies/CookiesUtils';

export const ChangeNewPassword = async (data) => {
  try {
    const token = accessToken();
    const response = await axios.patch(
  `${HOST_API_SERVER}/nvc-core/api/v1/users/password`,
  data,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);


    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.error || ERROR_MESSAGES,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || ERROR_MESSAGES,
    };
  }
};
