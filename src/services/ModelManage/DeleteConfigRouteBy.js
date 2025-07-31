import axios from 'axios';
import { HOST_API_SERVER } from 'services/config';
import { accessToken } from 'utils/cookies/CookiesUtils';
import qs from 'qs';

export const DeleteConfigRouteBy = async (id) => {

  try {
    const token = accessToken()
    const response = await axios.delete(
      `${HOST_API_SERVER}/mes-admin/api/v1/config-prod-route/ids`,
      {
        params: { id },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "ERROR_DATA",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      
      success: false,
      message: error.response
        ? error.response.data.message
        : error.message,
    };
  }
  
};
