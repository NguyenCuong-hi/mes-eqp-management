import axios from 'axios';
import { accessToken } from 'utils/cookies/CookiesUtils';
import { HOST_API_SERVER } from 'services/config';


export const UpdateConfigProdBy = async (id, dto) => {
  try {
    const token = accessToken();

    if (!token) {
      return {
        success: false,
        message: 'Token không tồn tại. Vui lòng đăng nhập lại.',
      };
    }

     const response = await axios.put(
      `${HOST_API_SERVER}/mes-admin/api/v1/config-prod/${id}`,
      dto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status, data: responseData } = response;

    if (status === 200 || status === 201) {
      return {
        success: true,
        data: responseData,
      };
    } else {
      return {
        success: false,
        message: responseData?.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message,
    };
  }
};
