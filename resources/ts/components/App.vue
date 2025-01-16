<template>
  <VApp color="primary">
    <span class="bg"></span>


    <VNavigationDrawer v-model="drawer" :clipped="false" :permanent="false" >
      <VList density="compact">
        <VListItem>
          <VListItemTitle>
            <router-link to="/information" class="black--text">
              <VBadge v-if="content !== 0" color="blue" :content="content">
                Information
              </VBadge>
              <span v-else>Information</span>
            </router-link>
          </VListItemTitle>
        </VListItem>

        <!-- その他のリンク -->
        <VListItem v-for="link in links" :key="link.title">
          <VListItemContent>
            <router-link :to="link.to" class="black--text">
              <!-- v-icon -> VIcon -->
              <VIcon>{{ link.icon }}</VIcon> {{ link.title }}
            </router-link>
          </VListItemContent>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <!-- アプリケーションバー -->
    <!-- v-app-bar -> VAppBar -->
    <VAppBar bg-color="#0077ff" color="primary">
      <!-- v-app-bar-nav-icon -> VAppBarNavIcon -->
      <VAppBarNavIcon @click="toggleDrawer" />
      <!-- v-toolbar-title -> VToolbarTitle -->
      <VToolbarTitle>Europa - Carnage Heart EXA Uploader</VToolbarTitle>
      <!-- v-spacer -> VSpacer -->
      <VSpacer />
      <VToolbarTitle v-if="auth">{{ `Login As: ${auth.name}` }}</VToolbarTitle>
    </VAppBar>

    <!-- ルータービュー -->
    <router-view :flash="flash" />

    <!-- フッター -->
    <!-- v-footer -> VFooter -->
    <VFooter bg-color="#0077ff" color="primary">
      <span>&copy; Team Project Europa 2016-{{ new Date().getFullYear() }}</span>
    </VFooter>

    <!-- スナックバー -->
    <!-- v-snackbar -> VSnackbar -->
    <VSnackbar v-model="snackMessage" location="top center" color="error">
      サーバー内部でエラーが発生しました。
      <div v-for="(error, key) in errors" :key="key">{{ error.toString() }}</div>
      <template #actions>
        <VBtn @click="snackMessage = false">x</VBtn>
      </template>
    </VSnackbar>

    <VSnackbar v-model="flashMessage" location="top center" color="success" timeout="2000">
      {{ flash }}
    </VSnackbar>
  </VApp>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Propsの定義
const props = defineProps<{
  auth: { name: string } | null;
  errors?: string[];
  flash: string | null;
}>();

// State
const { errors, flash } = props;
const drawer = ref(false);
const snackMessage = ref(false);
const flashMessage = ref(false);
const content = ref(0);

// 動的リンク
const links = [
  { title: 'Search Team Data', to: '/search/team', icon: 'mdi-file-import' },
  { title: 'Search Match Data', to: '/search/match', icon: 'mdi-file-import' },
  { title: 'Simple Upload', to: '/simpleupload', icon: 'mdi-upload' },
  { title: 'Upload', to: '/upload', icon: 'mdi-upload' },
  { title: 'My Page', to: '/mypage', icon: 'mdi-account' },
];

// トグルメソッド
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// イベント取得
const getEvents = async () => {
  try {
    const response = await axios.get('/api/event');
    content.value = response.data.data.length || 0;
  } catch (err) {
    console.error(err);
  }
};

// Mounted
onMounted(() => {
  if (errors?.length) snackMessage.value = true;
  if (flash) flashMessage.value = true;
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
  background-image: url('/images/Europa.jpg');
}
</style>
