import axios from 'axios';
import { HOST_API_SERVER } from 'services/config';
import { accessToken } from 'utils/cookies/CookiesUtils';
import qs from 'qs';


export const DeleteMenuByService = async (idRole, menus) => {
  try {
    const token = accessToken();
      const response = await axios.put(
      `${HOST_API_SERVER}/nvc-core/api/v1/menu-item/role/${idRole}`,
      menus
      ,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
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
    return {
      
      success: false,
      message: error.response
        ? error.response.data.message
        : error.message,
    };
  }
};
