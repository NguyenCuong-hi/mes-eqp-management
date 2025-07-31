import axios from "axios";
import { HOST_API_SERVER } from "services/config";
import { accessToken } from "utils/cookies/CookiesUtils";

export const SearchAuthoritiesBy = async (search) => {
  try {
    const token = accessToken();
    const response = await axios.get(`${HOST_API_SERVER}/authorities/page`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        data: response.data.data.content,
      };
    } else {
      return {
        success: false,
        message: response.data.message || ERROR_MESSAGES ,
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