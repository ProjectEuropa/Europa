<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ delObj.file_name }}を本当に削除しますか？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-flex>
            <v-btn class="text-left" color="green darken-1" text @click="close">キャンセル</v-btn>
          </v-flex>

          <v-flex class="text-xs-right">
            <v-btn
              color="red darken-1"
              text
              :loading="loading"
              :disabled="loading"
              @click="exexuteDelete()"
            >削除実行</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :vertical="true"
      :color="color"
      :timeout="2000"
    >{{ snackbarText }}</v-snackbar>
  </v-row>
</template>

<script lang="ts">
import { TargetDeleteFileObject } from "../../vue-data-entity/TargetDeleteFileObject";
import { Vue, Component, Prop } from "vue-property-decorator";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

@Component
export default class DeleteUserModal extends Vue {
  dialog: boolean = false;
  loading: boolean = false;
  snackbar: boolean = false;
  snackbarText: string = "";
  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");
  color: string = "success";

  @Prop()
  delObj!: TargetDeleteFileObject;

  @Prop()
  fileType!: string;

  /**
   * name
   */
  public open() {
    this.dialog = true;
  }
  /**
   * name
   */
  public close() {
    this.dialog = false;
  }

  /**
   * name
   */
  public exexuteDelete() {
    this.loading = true;
    Vue.prototype.$http
      .post("/api/delete/usersRegisteredCloumn", {
        id: this.delObj.id,
        fileType: this.fileType,
        _token: this.csrf
      })
      .then((res: AxiosResponse): void => {
        this.snackbarText = `${this.delObj.file_name}の削除が完了しました。`;
        this.color = "success";
        this.snackbar = true;
        this.dialog = false;
        setTimeout(() => {
          this.$router.go(0);
        }, 2000);
      })
      .catch((err: AxiosError): void => {
        this.loading = false;
        this.color = "error";
        this.snackbar = true;
        this.snackbarText = `${this.delObj.file_name}の削除に失敗しました。`;
      });
  }
}
</script>
