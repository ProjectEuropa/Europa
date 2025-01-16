<script lang="ts" setup>
import { ref, watch, getCurrentInstance } from "vue";
import { useField, defineRule } from "vee-validate";
import { required, max } from "@vee-validate/rules";
import { UploadObject } from "@/vue-data-entity/UploadObject";
import {AxiosInstance} from "axios";
const instance = getCurrentInstance();
const http = instance?.proxy?.$axios as AxiosInstance | undefined;

// VeeValidateのルール定義
defineRule("required", required);
defineRule("max", max);

// フォームフィールド
const ownerName = useField<string>("ownerName", "required|max:100");
const comment = useField<string>("comment", "required|max:200");
const deletePassword = useField<string>("deletePassword", "required|max:100");
const teamDownloadableAt = useField<string>("teamDownloadableAt");
const teamFile = ref<File | null>(null);
const searchTag = ref<string[]>([]);

// チームデータ用アイテム
const itemTeam = ref(["大会ゲスト許可", "フリーOKE"]);

// マッチデータ用アイテム
const itemMatch = ref(["フルリーグ", "ハーフリーグ", "上級演習所"]);
const csrf = ref(document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "");

const uploadObject = ref<UploadObject>({
  owner_name: "",
  file_name: "",
  file_comment: "",
  searchTag: [],
  deletePassword: "",
  downloadable_at: "",
});

// チームデータ用のタグ数制限
watch(searchTag, (newVal) => {
  if (newVal.length > 4) {
    searchTag.value.pop();
  }
});

// フォーム送信処理（ダイアログオープン）
const teamDialogOpen = async () => {
  // 各フィールドの検証を実行
  const { valid: isOwnerNameValid } = await ownerName.validate(); // validate() を呼び出す正しい方法
  const { valid: isCommentValid } = await comment.validate();
  const { valid: isDeletePasswordValid } = await deletePassword.validate();
  const { valid: isTeamDownloadableAtValid } = await teamDownloadableAt.validate();

  const isValid =
    isOwnerNameValid &&
    isCommentValid &&
    isDeletePasswordValid &&
    isTeamDownloadableAtValid;

  if (isValid) {
    uploadObject.value = {
      owner_name: ownerName.value,
      file_name: teamFile.value?.name || "",
      file_comment: comment.value,
      searchTag: searchTag.value,
      deletePassword: deletePassword.value,
      downloadable_at: teamDownloadableAt.value,
    };

  } else {
    console.log("入力エラーが発生しました");
  }
};

// ファイル選択処理
const handleFileSelected = (file: File | null) => {
  teamFile.value = file;
};
</script>

<template>
  <v-container fluid class="d-flex">
    <v-col cols="12" md="12">
      <v-form>
        <!-- CSRFトークン -->
        <input type="hidden" name="_token" :value="csrf" />

        <v-row align="center" justify="center">
          <v-card class="mx-auto">
            <!-- ヘッダー -->
            <v-card-title class="blue">
              <v-list-item>
                <v-list-item-action>
                  <v-icon>mdi-upload</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title class="headline white--text">簡易アップロード(チームデータ)</v-list-item-title>
                  <v-list-item-subtitle class="white--text">ユーザー登録無しでチームデータのアップロード可能</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-title>

            <!-- 入力エリア -->
            <v-col cols="12" md="12">
              <!-- オーナー名 -->
              <v-text-field
                v-model="ownerName.value"
                :error-messages="ownerName.errorMessage"
                label="オーナー名"
                prepend-icon="mdi-account-circle"
              ></v-text-field>

              <!-- コメント -->
              <v-textarea
                v-model="comment.value"
                :error-messages="comment.errorMessage"
                label="コメント"
                prepend-icon="mdi-comment-multiple-outline"
              ></v-textarea>

              <!-- 検索タグ -->
              <v-combobox
                v-model="searchTag"
                :items="itemTeam"
                label="検索タグ"
                multiple
                chips
                prepend-icon="mdi-tag-plus"
              ></v-combobox>

              <!-- 削除パスワード -->
              <v-text-field
                v-model="deletePassword.value"
                :error-messages="deletePassword.errorMessage"
                label="削除パスワード"
                type="password"
                prepend-icon="mdi-lock"
              ></v-text-field>

              <!-- チームデータアップロード -->
              <v-file-input
                label="チームデータ"
                v-model="teamFile"
                prepend-icon="mdi-file-upload"
                :show-size="true"
                @change="handleFileSelected"
              ></v-file-input>

              <!-- ダウンロード可能日時 -->
              <v-text-field
                v-model="teamDownloadableAt.value"
                label="ダウンロード可能日時"
                type="datetime-local"
                prepend-icon="mdi-calendar-clock"
              ></v-text-field>
            </v-col>

            <!-- ボタン -->
            <v-card-actions class="justify-center">
              <v-btn large block class="primary" @click="teamDialogOpen">チームデータアップロード</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-form>
    </v-col>
  </v-container>
</template>

