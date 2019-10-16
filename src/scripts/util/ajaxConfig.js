// import router from './router'
import { message } from 'antd';
import axios from 'axios';

axios.jsonp = require('jsonp');
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true; // 注掉此处是因为yapi有跨域 不允许*
// POST传参序列化
axios.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  config.params._timeStamp = +new Date();
  return config;
}, (error) => {
  return Promise.reject(error);
});
// code状态码200判断
axios.interceptors.response.use((res) => {
  const { data: { status } } = res;
  if (status === 403) {
    location.href = '#/login';
    location.reload(true);
  }
  if (status !== 0) {
    message.error(res.data.message);
    return Promise.reject(res.data.message);
  }
  return res;
}, (error) => {
  message.error(error);
  return Promise.reject(error);
});


export default axios;
