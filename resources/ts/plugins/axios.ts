import { App } from "vue";
import axios from "axios";

export default {
  install(app: App): void {
    // Axiosインスタンスの作成
    const axiosPlugin = axios.create({
      responseType: "json",
    });

    // ヘッダーにAPIトークンを設定
    const token = document
      .querySelector('meta[name="api-token"]')
      ?.getAttribute("content");
    if (token) {
      axiosPlugin.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("APIトークンが見つかりませんでした");
    }

    app.config.globalProperties.$axios = axiosPlugin;
  },
};
