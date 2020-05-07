
<template>
  <v-content>
    <v-container>
      <v-card>
        <v-toolbar flat color="primary" dark>
          <v-toolbar-title>Mypage</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical>
          <v-tab>
            <v-icon left>mdi-account</v-icon>Profile
          </v-tab>
          <v-tab>
            <v-icon left>mdi-microsoft-teams</v-icon>Upload Team Data
          </v-tab>
          <v-tab>
            <v-icon left>mdi-gamepad-variant-outline</v-icon>Upload Match Data
          </v-tab>
          <v-tab>
            <v-icon left>mdi-calendar-text</v-icon>Register Events
          </v-tab>

          <v-tab-item>
            <v-card flat>
              <ValidationObserver ref="observer">
                <v-card-text>
                  <ValidationProvider v-slot="{ errors }" name="オーナー名" rules="required|max:100">
                    <v-text-field
                      prepend-icon="mdi-account-circle"
                      v-model="name"
                      name="name"
                      :counter="100"
                      :error-messages="errors"
                      label="名前"
                      required
                    ></v-text-field>
                    <v-card-actions>
                      <v-btn primary large block class="primary" @click="userDialogOpen()">Update</v-btn>
                    </v-card-actions>
                  </ValidationProvider>
                </v-card-text>
              </ValidationObserver>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">オーナー名</th>
                        <th class="text-left">コメント</th>
                        <th class="text-left">ファイル名</th>
                        <th class="text-left">アップロード日時</th>
                        <th class="text-left">削除</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in teams" :key="index">
                        <td>{{ item.upload_owner_name }}</td>
                        <td
                          style="white-space:pre-wrap; word-wrap:break-word;"
                        >{{ item.file_comment }}</td>
                        <td>{{ item.file_name }}</td>
                        <td>{{ item.created_at }}</td>
                        <td>
                          <v-icon
                            @click="dialogOpen(item.file_name, item.id, 'team')"
                          >mdi-delete-forever</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">オーナー名</th>
                        <th class="text-left">コメント</th>
                        <th class="text-left">ファイル名</th>
                        <th class="text-left">アップロード日時</th>
                        <th class="text-left">削除</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in matches" :key="index">
                        <td>{{ item.upload_owner_name }}</td>
                        <td
                          style="white-space:pre-wrap; word-wrap:break-word;"
                        >{{ item.file_comment }}</td>
                        <td>{{ item.file_name }}</td>
                        <td>{{ item.created_at }}</td>
                        <td>
                          <v-icon
                            @click="dialogOpen(item.file_name, item.id, 'match')"
                          >mdi-delete-forever</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">イベント名</th>
                        <th class="text-left">イベント詳細</th>
                        <th class="text-left">イベント受付期間締切日</th>
                        <th class="text-left">イベント表示最終日</th>
                        <th class="text-left">削除</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in events" :key="index">
                        <td>{{ item.event_name }}</td>
                        <td
                          style="white-space:pre-wrap; word-wrap:break-word;"
                        >{{ item.event_details }}</td>
                        <td>{{ item.event_closing_day }}</td>
                        <td>{{ item.event_displaying_day }}</td>
                        <td>
                          <v-icon
                            @click="dialogOpen(item.event_name, item.id, 'event')"
                          >mdi-delete-forever</v-icon>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <confirm-user-modal ref="userDialog" :name="name"></confirm-user-modal>
      <delete-user-modal ref="dialog" :delObj="delObj" :fileType="fileType"></delete-user-modal>
    </v-container>
  </v-content>
</template>


<script lang="ts">
import { TargetDeleteFileObject } from "../../vue-data-entity/TargetDeleteFileObject";
import { FileDataObject } from "../../vue-data-entity/FileDataObject";
import { MypageFileObject } from "../../laravel-data-entity/FilePaginateObject";
import {
  ScheduleObject,
  ScheduleObjectSynchronizedLaravelEvents,
  LaravelApiReturnEventsJson
} from "../../vue-data-entity/ScheduleDataObject";
import DeleteUserModal from "../modules/DeleteUserModal.vue";
import ConfirmUserModal from "../modules/ConfirmUserModal.vue";
import { ValidationObserver } from "vee-validate";
import { Vue, Component } from "vue-property-decorator";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

@Component({
  components: {
    DeleteUserModal,
    ConfirmUserModal
  }
})
export default class Mypage extends Vue {
  name: string = "";
  teams: Array<FileDataObject> = [];
  matches: Array<FileDataObject> = [];
  events: Array<ScheduleObjectSynchronizedLaravelEvents> = [];
  delObj: TargetDeleteFileObject = { id: 0, file_name: "" };
  fileType: string = "";

  $refs!: {
    dialog: DeleteUserModal;
    userDialog: ConfirmUserModal;
    observer: InstanceType<typeof ValidationObserver>;
  };

  /**
   * name
   */
  public created() {
    Vue.prototype.$http
      .get(`/api/mypage/team`)
      .then((res: AxiosResponse<MypageFileObject>): void => {
        this.teams = res.data.data;
      });

    Vue.prototype.$http
      .get(`/api/mypage/match`)
      .then((res: AxiosResponse<MypageFileObject>): void => {
        this.matches = res.data.data;
      });

    Vue.prototype.$http
      .get(`/api/mypage/events`)
      .then((res: AxiosResponse<LaravelApiReturnEventsJson>): void => {
        this.events = res.data.data;
      });

    Vue.prototype.$http
      .get(`/api/user`)
      .then((res: AxiosResponse<any>): void => {
        this.name = res.data.name;
      })
      .catch((): void => {
        alert("ユーザー情報の取得に失敗しました。ログアウトして再ログインしてください。");
        location.href = "/auth/logout";
      });
  }

  /**
   * name
   */
  public dialogOpen(file_name: string, id: number, fileType: string) {
    this.delObj.file_name = file_name;
    this.delObj.id = id;
    this.fileType = fileType;
    this.$refs.dialog.open();
  }

  /**
   * name
   */
  public async userDialogOpen() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      this.$refs.userDialog.open();
    }
  }
}
</script>
