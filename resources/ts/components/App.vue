<template>
  <v-app id="inspire">
    <span class="bg"></span>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-folder-information-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-badge color="blue" :content="content" v-if="content !== 0">
                <router-link class="black--text" to="/information">Information</router-link>
              </v-badge>
              <router-link class="black--text" to="/information" v-else>Information</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-file-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/search/team">Search Team Data</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-file-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/search/match">Search Match Data</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!auth">
          <v-list-item-action>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/simpleupload">Simple Upload</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="auth">
          <v-list-item-action>
            <v-icon>mdi-upload</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/upload">Upload</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-database-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/sumdownload/team">Sum Download Team Data</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-database-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/sumdownload/match">Sum Download Match Data</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="auth">
          <v-list-item-action>
            <v-icon>mdi-bell-ring</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/eventnotice">Eventnotice</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="auth">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/mypage">Mypage</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!auth">
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/login">Login</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!auth">
          <v-list-item-action>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/register">Register</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="auth">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <a class="black--text" href="/auth/logout">Logout</a>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue darken-3 white--text">
      <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Europa - Carnage Heart EXA Uploader -</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="auth">{{ `Login As: ${auth.name}` }}</v-toolbar-title>
    </v-app-bar>

    <router-view :flash="flash"></router-view>

    <v-footer app clipped-center color="blue darken-3 white--text">
      <span>&copy; Team Project Europa 2016-{{ new Date().getFullYear() }}</span>
    </v-footer>

    <v-snackbar v-model:visible="snackMessage" color="error" top vertical>
      サーバー内部でエラーが発生しました。
      <div v-for="(error, key) in errors" :key="key">{{ error.toString() }}</div>
      <v-btn dark text @click="snackMessage = false">x</v-btn>
    </v-snackbar>

    <v-snackbar v-model:visible="flashMessage" vertical color="success" timeout="2000">
      {{ flash }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted } from 'vue';
import type { AxiosInstance } from 'axios';
import type { ScheduleObjectSynchronizedLaravelEvents, LaravelApiReturnEventsJson } from '@/vue-data-entity/ScheduleDataObject';
import type { AuthUserObject } from '@/vue-data-entity/AuthUserObject';
const http = inject<AxiosInstance>('http'); // プラグインから注入された Axios インスタンス
if (!http) {
  throw new Error('HTTP Client is not provided!'); // 注入されていない場合のエラーハンドリング
}

const props = defineProps<{
  auth: AuthUserObject | null;
  errors: string[];
  flash: string | null;
}>();

// プロパティを分割（デストラクチャリング）
const { errors, flash } = props;


// Reactive States
const drawer = ref(false);
const snackMessage = ref(false);
const flashMessage = ref(false);
const events = ref<ScheduleObjectSynchronizedLaravelEvents[]>([]);
const content = ref(0);

// Methods
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const getEvents = async () => {
  try {
    const response = await http.get<LaravelApiReturnEventsJson>('/api/event');
    events.value = response.data.data;
    content.value = events.value.length;
  } catch (error) {
    alert('検索実行時にエラーが発生しました');
  }
};

onMounted(() => {
  if (errors.length !== 0) {
    snackMessage.value = true;
  }
  if (flash) {
    flashMessage.value = true;
  }
  getEvents();
});
</script>

<style>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  background-image: url("/images/Europa.jpg");
}

.text-white {
  color: white;
}
</style>
