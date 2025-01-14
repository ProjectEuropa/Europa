// Vue 3用に構築したエントリーファイル
import { createApp } from 'vue'; // Vue 3のエントリーポイント
import { createVuetify } from 'vuetify'; // Vuetify 3の設定用
import 'vuetify/styles'; // Vuetifyのスタイルシート
import '@mdi/font/css/materialdesignicons.css'; // MDIアイコン用スタイル
import App from './components/App.vue'; // ルートコンポーネント
import router from './router'; // Vue Router 4の設定
import { defineRule, configure } from 'vee-validate'; // vee-validateのルール関連設定
import { required, email, max, min, confirmed } from '@vee-validate/rules'; // 各種ルール
import http from './plugins/http'; // カスタムプラグイン

// Vuetifyの設定（アイコンのセットをカスタマイズ可能）
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // MDIアイコンを使用
  },
});

// vee-validateのルール設定（Vue 3用）
defineRule('required', required); // 必須項目
defineRule('email', email);       // メール形式
defineRule('max', max);           // 最大文字長
defineRule('min', min);           // 最小文字長
defineRule('confirmed', confirmed); // 確認フィールド

// vee-validateのグローバルな設定（エラーメッセージのカスタマイズ）
configure({
  generateMessage: (context) => {
    const messages: Record<string, string> = {
      required: `${context.field} は必須です`,
      email: 'メールアドレスの形式が不正です',
      max: `${context.field} は最大 ${context.rule?.params?.length} 文字までです`,
      min: `${context.field} は最低 ${context.rule?.params?.length} 文字必要です`,
      confirmed: '再確認パスワードと入力が一致していません',
    };

    return messages[context.rule?.name || ''] || `${context.field} の入力が無効です`;
    },
});


const app = createApp(App);
app.mount('#app');
app.use(router);  // Vue Router 4を登録
app.use(vuetify); // Vuetify 3を登録
app.use(http);    // カスタムHTTPプラグインを登録

// アプリケーションをマウント
app.mount('#app'); // VueインスタンスをDOMにマウント
