import { App } from "vue";
import axios from "axios";

export default {
  install(app: App): void {
    // Axiosインスタンスの作成
    const http = axios.create({
      responseType: "json",
    });

    // ヘッダーにAPIトークンを設定
    const token = document
      .querySelector('meta[name="api-token"]')
      ?.getAttribute("content");
    if (token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn("APIトークンが見つかりませんでした");
    }

    // Vueアプリケーションに`$http`をグローバルプロパティとして登録
    app.config.globalProperties.$http = http;

    // 必要に応じてprovide（依存性注入）も設定可能
    app.provide("http", http);
  },
};
