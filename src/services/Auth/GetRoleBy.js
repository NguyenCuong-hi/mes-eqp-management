import { ERROR_MESSAGES } from '../../utils/constants';

export const AuthLoginService = async (data) => {
  try {
    const token = await accessToken()
    const response = await axios.post(
      `${HOST_API_SERVER_4}/token`,
      data,
      {
        headers: {
            Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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
        message: response.data.message || ERROR_MESSAGES.ERROR_DATA,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : ERROR_MESSAGES.ERROR,
    };
  }
};
