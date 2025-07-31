
export const GetUserService = async () => {
  try {
    const token = accessToken();

    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

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
