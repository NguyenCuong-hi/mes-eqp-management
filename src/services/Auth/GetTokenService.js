import axios from 'axios';
import { HOST_API_SERVER_AUTH } from 'services/config';

export const AuthLoginService = async (data) => {
  try {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('client_id', 'core_client');
    formData.append('client_secret', 'secret');
    formData.append('grant_type', 'password');

    const response = await axios.post(
      `${HOST_API_SERVER_AUTH}/nvc-core/oauth/token`,
      formData,
      {
        headers: {
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
        message: response.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response
    };
  }
};
