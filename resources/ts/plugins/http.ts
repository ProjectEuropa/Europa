import _Vue from 'vue';
import axios from 'axios';

export default {
  install(Vue: typeof _Vue): void {
    const http = axios.create({
      responseType: "json"
    });
    http.defaults.headers.common['Authorization'] = "Bearer " + document
      .querySelector('meta[name="api-token"]')!
      .getAttribute("content");
    Vue.prototype.$http = http;
  },
};
