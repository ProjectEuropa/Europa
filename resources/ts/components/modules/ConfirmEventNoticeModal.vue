<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">アップロードする内容を確認してください</v-card-title>

        <v-card-text class="d-flex flex-column">
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-calendar-edit</v-icon>
            イベント名:{{ storeObj.event_name }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-comment-multiple-outline</v-icon>
            イベント詳細情報:{{ storeObj.event_details }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-google</v-icon>
            イベント詳細URL:{{ storeObj.url }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-av-timer</v-icon>
            イベント受付期間締切日:{{ storeObj.event_closing_day }}
          </v-chip>
          <v-chip class="ma-2" color="blue" label text-color="white" cols="12" md="12">
            <v-icon left>mdi-lastpass</v-icon>
            イベント表示最終日:{{ storeObj.event_displaying_day }}
          </v-chip>
        </v-card-text>
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
              @click="submit()"
            >アップロード</v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ConfirmEventNoticeModal extends Vue {
  dialog: boolean = false;
  loading: boolean = false;
  @Prop()
  storeObj!: string;
  /**
   * name
   */
  public open() {
    this.dialog = true;
  }
  /**
   * name
   */
  public submit() {
    this.loading = true;
    (<HTMLFormElement>document.querySelector("#store")).submit();
  }

  /**
   * name
   */
  public close() {
    this.dialog = false;
  }
}
</script>
