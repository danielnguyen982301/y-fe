import axios from 'axios';
import { BASE_URL } from './config';
import { getSession } from './actions';
import Cookies from 'js-cookie';

const apiService = axios.create({
  baseURL: BASE_URL,
});

apiService.interceptors.request.use(
  async (req) => {
    const session = await getSession();
    if (session && session.accessToken) {
      req.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    console.log('Request', req);

    return req;
  },
  function (err) {
    console.log('Request Error', err);
    return Promise.reject(err);
  },
);

apiService.interceptors.response.use(
  (res) => {
    console.log('Response', res);
    return res.data;
  },
  function (err) {
    console.log('Response Error', err);
    const message = err.response?.data?.errors?.message || 'Unknown Error';
    return Promise.reject({ message });
  },
);

export default apiService;
