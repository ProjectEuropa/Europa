import { createApp } from 'vue';
import vuetify from './plugins/vuetify'
import App from './components/App.vue';
import router from './router'; // Vue Router 4の設定
import { defineRule, configure } from 'vee-validate'; // vee-validateのルール関連設定
import { required, email, max, min, confirmed } from '@vee-validate/rules'; // 各種ルール
import axiosPlugin from "./plugins/axios"; // 提示されているプラグインファイル



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

    return messages[context.rule?.name ?? ''] || `${context.field} の入力が無効です`;
    },
});


createApp(App)
  .use(vuetify)
  .use(router)
  .use(axiosPlugin)
  .mount('#app')
