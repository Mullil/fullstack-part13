import axios from 'axios'
const baseUrl = '/api/logout'

const logout = async (token) => {
  await axios.delete(baseUrl, { data: { token } })
}

export default { logout }