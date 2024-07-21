import axios from 'axios';
import { getSession } from './actions';

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

apiService.interceptors.request.use(
  async (req) => {
    const session = await getSession();
    if (session && session.accessToken) {
      req.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return req;
  },
  function (err) {
    return Promise.reject(err);
  },
);

apiService.interceptors.response.use(
  (res) => {
    return res.data;
  },
  function (err) {
    const message = err.response?.data?.errors?.message || 'Unknown Error';
    return Promise.reject({ message });
  },
);

export default apiService;
