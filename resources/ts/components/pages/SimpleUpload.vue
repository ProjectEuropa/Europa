<template>
  <v-content>
    <v-container fluid class="d-flex">
      <v-col cols="12" md="12">
        <ValidationObserver ref="team">
          <v-form
            method="POST"
            action="/team/simpleupload"
            id="team-simple-upload"
            lazy-validation
            justify="center"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="_token" :value="csrf" />
            <v-row align="center" justify="center">
              <v-card class="mx-auto">
                <v-card-title class="blue">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>mdi-upload</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title class="headline white--text">簡易アップロード(チームデータ)</v-list-item-title>
                      <v-list-item-subtitle class="white--text">ユーザー登録処理をせずにチームデータアップロードが可能です。</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-title>
                <v-col cols="12" md="12">
                  <ValidationProvider v-slot="{ errors }" name="オーナー名" rules="required|max:100">
                    <v-text-field
                      prepend-icon="mdi-account-circle"
                      v-model="ownerName"
                      :counter="100"
                      label="オーナー名"
                      name="teamOwnerName"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="コメント" rules="required|max:200">
                    <v-textarea
                      prepend-icon="mdi-comment-multiple-outline"
                      v-model="comment"
                      label="コメント"
                      name="teamComment"
                      :error-messages="errors"
                      required
                    ></v-textarea>
                  </ValidationProvider>
                  <v-combobox
                    v-model="searchTag"
                    :items="itemTeam"
                    label="検索タグ"
                    name="teamSearchTags"
                    multiple
                    chips
                    prepend-icon="mdi-tag-plus"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :key="JSON.stringify(data.item)"
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        @click:close="data.parent.selectItem(data.item)"
                      >
                        <v-avatar
                          class="accent white--text"
                          left
                          v-text="data.item.slice(0, 1).toUpperCase()"
                        ></v-avatar>
                        {{ data.item }}
                      </v-chip>
                    </template>
                  </v-combobox>
                  <ValidationProvider v-slot="{ errors }" name="削除パスワード" rules="required|max:100">
                    <v-text-field
                      prepend-icon="mdi-lock"
                      v-model="deletePassword"
                      :counter="100"
                      type="password"
                      label="削除パスワード"
                      name="teamDeletePassWord"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="チームデータ" rules="required">
                    <v-file-input
                      name="teamFile"
                      append-icon
                      show-size
                      counter
                      v-model="teamFile"
                      :error-messages="errors"
                      label="チームデータ"
                    ></v-file-input>
                  </ValidationProvider>
                </v-col>
                <v-card-actions class="justify-center">
                  <v-btn large block class="primary" @click="teamDialogOpen()">チームデータアップロード</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-container>

    <v-container>
      <v-col cols="12" md="12">
        <ValidationObserver ref="match">
          <v-form
            method="POST"
            action="/match/simpleupload"
            id="match-simple-upload"
            lazy-validation
            justify="center"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="_token" :value="csrf" />
            <v-row align="center" justify="center">
              <v-card class="mx-auto">
                <v-card-title class="blue-grey">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon>mdi-upload</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title class="headline white--text">簡易アップロード(マッチデータ)</v-list-item-title>
                      <v-list-item-subtitle class="white--text">ユーザー登録処理をせずにマッチデータのアップロードが可能です。</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card-title>
                <v-col cols="12" md="12">
                  <ValidationProvider v-slot="{ errors }" name="オーナー名" rules="required|max:100">
                    <v-text-field
                      prepend-icon="mdi-account-circle"
                      v-model="matchOwnerName"
                      :counter="10"
                      label="オーナー名"
                      name="matchOwnerName"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="コメント" rules="required|max:200">
                    <v-textarea
                      prepend-icon="mdi-comment-multiple-outline"
                      v-model="matchComment"
                      label="コメント"
                      name="matchComment"
                      :error-messages="errors"
                      required
                    ></v-textarea>
                  </ValidationProvider>
                  <v-combobox
                    v-model="matchSearchTag"
                    :items="itemMatch"
                    label="検索タグ"
                    name="matchSearchTags"
                    multiple
                    chips
                    prepend-icon="mdi-tag-plus"
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :key="JSON.stringify(data.item)"
                        v-bind="data.attrs"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        @click:close="data.parent.selectItem(data.item)"
                      >
                        <v-avatar
                          class="accent white--text"
                          left
                          v-text="data.item.slice(0, 1).toUpperCase()"
                        ></v-avatar>
                        {{ data.item }}
                      </v-chip>
                    </template>
                  </v-combobox>
                  <ValidationProvider v-slot="{ errors }" name="削除パスワード" rules="required|max:100">
                    <v-text-field
                      name="matchDeletePassWord"
                      prepend-icon="mdi-lock"
                      v-model="deletePassword"
                      :counter="100"
                      type="password"
                      label="削除パスワード"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="マッチデータ" rules="required">
                    <v-file-input
                      name="matchFile"
                      append-icon
                      show-size
                      counter
                      v-model="matchFile"
                      :error-messages="errors"
                      label="マッチデータ"
                    ></v-file-input>
                  </ValidationProvider>
                </v-col>
                <v-card-actions class="justify-center">
                  <v-btn
                    large
                    block
                    color="blue-grey"
                    class="white--text"
                    @click="matchDialogOpen"
                  >マッチデータアップロード</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-container>
    <confirm-upload-modal ref="dialog" :uploadObject="uploadObject"></confirm-upload-modal>
  </v-content>
</template>

<script lang="ts">
import ConfirmUploadModal from "../modules/ConfirmUploadModal.vue";
import { UploadObject } from "../../vue-data-entity/UploadObject";
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { ValidationObserver } from "vee-validate";

@Component({
  components: {
    ConfirmUploadModal
  }
})
export default class SimpleUpload extends Vue {
  itemTeam: Array<string> = ["大会ゲスト許可", "フリーOKE"];
  itemMatch: Array<string> = ["フルリーグ", "ハーフリーグ", "上級演習所"];
  ownerName: string = "";
  comment: string = "";
  searchTag: Array<string> = [];
  deletePassword: string = "";
  csrf: string | null = document
    .querySelector('meta[name="csrf-token"]')!
    .getAttribute("content");
  teamFile: File = new File([], "", {});
  matchOwnerName: string = "";
  matchComment: string = "";
  matchSearchTag: Array<string> = [];
  matchDeletePassword: string = "";
  matchFile: File = new File([], "", {});
  uploadObject: UploadObject = {
    owner_name: "",
    file_name: "",
    file_comment: "",
    searchTag: [],
    deletePassword: ""
  };

  $refs!: {
    dialog: ConfirmUploadModal;
    team: InstanceType<typeof ValidationObserver>;
    match: InstanceType<typeof ValidationObserver>;
  };

  /**
   * watch
   */
  @Watch("searchTag")
  onSearchTagChanged() {
    if (this.searchTag.length > 4) {
      this.$nextTick(() => this.searchTag.pop());
    }
  }

  /**
   * watch
   */
  @Watch("matchSearchTag")
  onMatchSearchTagChanged() {
    if (this.matchSearchTag.length > 4) {
      this.$nextTick(() => this.matchSearchTag.pop());
    }
  }

  /**
   * name
   */
  public async teamDialogOpen() {
    const isValid = await this.$refs.team.validate();
    if (isValid) {
      this.uploadObject.owner_name = this.ownerName;
      this.uploadObject.file_name = this.teamFile.name;
      this.uploadObject.file_comment = this.comment;
      this.uploadObject.searchTag = this.searchTag;
      this.$refs.dialog.open("#team-simple-upload");
    }
  }

  /**
   * name
   */
  public async matchDialogOpen() {
    const isValid = await this.$refs.match.validate();
    if (isValid) {
      this.uploadObject.owner_name = this.matchOwnerName;
      this.uploadObject.file_name = this.matchFile.name;
      this.uploadObject.file_comment = this.matchComment;
      this.uploadObject.searchTag = this.matchSearchTag;
      this.$refs.dialog.open("#match-simple-upload");
    }
  }
}
</script>
