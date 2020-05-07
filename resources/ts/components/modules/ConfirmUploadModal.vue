<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">アップロードする内容を確認してください</v-card-title>

        <v-card-text class="d-flex flex-column">
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-account-circle</v-icon>
            オーナー名: {{ uploadObject.owner_name }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-comment-multiple-outline</v-icon>
            コメント: {{ uploadObject.file_comment }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-tag-plus</v-icon>
            検索タグ: {{ uploadObject.searchTag.toString() }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-paperclip</v-icon>
            アップロードファイル: {{ uploadObject.file_name }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-flex>
            <v-btn class="text-left" color="green darken-1" text @click="close">キャンセル</v-btn>
          </v-flex>

          <v-flex class="text-xs-right">
            <v-btn color="red darken-1" :loading="loading" :disable="loading" text @click="upload()">アップロード</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { UploadObject } from "../../vue-data-entity/UploadObject";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ConfirmUploadModal extends Vue {
  dialog: boolean = false;
  elementId: string = "";
  loading: boolean = false;

  @Prop()
  uploadObject!: UploadObject;

  /**
   * name
   */
  public open(elementId: string) {
    this.elementId = elementId;
    this.dialog = true;
  }
  /**
   * name
   */
  public close() {
    this.dialog = false;
  }

  /**
   * upload
   */
  public upload() {
    this.loading = true;
    (<HTMLFormElement>document.querySelector(this.elementId)).submit();
  }
}
</script>
