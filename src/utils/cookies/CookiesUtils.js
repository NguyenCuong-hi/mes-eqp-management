import Cookies from 'js-cookie'

export const accessToken = () => {
  return Cookies.get('token')
}

