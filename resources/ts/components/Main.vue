<template>
  <v-app id="inspire">
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
              <router-link class="black--text" to="/sumdownload/team">Sum Dowunload Team Data</router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-database-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <router-link class="black--text" to="/sumdownload/match">Sum Dowunload Match Data</router-link>
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Europa - Carnage Heart EXA Uploader -</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-title v-if="auth">Login As: {{auth.name}}</v-toolbar-title>
    </v-app-bar>

    <router-view :flash="flash"></router-view>

    <v-footer app clipped-center color="blue darken-3 white--text">
      <span>&copy; Team Project Europa 2016-{{new Date().getFullYear()}}</span>
    </v-footer>

    <v-snackbar v-model="snackMessage" color="error" :top="true" vertical>
      サーバー内部でエラーが発生しました。
      <div v-for="(error, key, index) in errors" :key="index">{{ error.toString() }}</div>
      <v-btn dark text @click="snackbar = false">x</v-btn>
    </v-snackbar>

    <v-snackbar
      v-model="flashMessage"
      :vertical="true"
      color="success"
      :timeout="2000"
      :default="false"
    >{{ flash }}</v-snackbar>
  </v-app>
</template>

<script lang="ts">
import {
  ScheduleObject,
  ScheduleObjectSynchronizedLaravelEvents,
  LaravelApiReturnEventsJson
} from "../vue-data-entity/ScheduleDataObject";
import { AuthUserObject } from "../vue-data-entity/AuthUserObject";
import { Vue, Component, Prop } from "vue-property-decorator";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

@Component
export default class App extends Vue {
  drawer: boolean = false;
  snackMessage: boolean = false;
  flashMessage: boolean = false;
  events: Array<ScheduleObjectSynchronizedLaravelEvents> = [];
  content: number = 0;

  @Prop()
  auth!: AuthUserObject | null;

  @Prop()
  errors!: any;

  @Prop({ default: null })
  flash!: string | null;

  /**
   * created
   */
  public created() {
    if (this.errors.length !== 0) {
      this.snackMessage = true;
    }
    if (this.flash) {
      this.flashMessage = true;
    }
    this.getEvents();
  }

  public getEvents() {
    Vue.prototype.$http
      .get(`/api/event`)
      .then((res: AxiosResponse<LaravelApiReturnEventsJson>): void => {
        this.events = res.data.data;
        this.content = this.events.length;
      })
      .catch((error: AxiosError): void => {
        alert("検索実行時にエラーが発生しました");
      });
  }
}
</script>
