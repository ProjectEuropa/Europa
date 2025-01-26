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
const { value: ownerName, errorMessage: ownerNameError, validate: validateOwnerName }
  = useField<string>("ownerName", "required|max:100");
const { value: comment, errorMessage: commentError, validate: validateComment }
  = useField<string>("comment", "required|max:200");
const { value: deletePassword, errorMessage: deletePasswordError, validate: validateDeletePassword }
  = useField<string>("deletePassword", "required|max:100");
const { value: teamDownloadableAt, errorMessage: teamDownloadableAtError, validate: validateTeamDownloadableAt }
  = useField<string>("teamDownloadableAt");
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
  const { valid: isOwnerNameValid } = await validateOwnerName();
  const { valid: isCommentValid } = await validateComment();
  const { valid: isDeletePasswordValid } = await validateDeletePassword();
  const { valid: isTeamDownloadableAtValid } = await validateTeamDownloadableAt();

  const isValid =
    isOwnerNameValid &&
    isCommentValid &&
    isDeletePasswordValid &&
    isTeamDownloadableAtValid;

  if (isValid) {
    uploadObject.value = {
      owner_name: ownerName.value ?? "",
      file_name: teamFile.value?.name || "",
      file_comment: comment.value ?? "",
      searchTag: searchTag.value,
      deletePassword: deletePassword.value ?? "",
      downloadable_at: teamDownloadableAt.value ?? "",
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
  <VContainer fluid class="d-flex">
    <VCol cols="12" md="12">
      <VForm @submit.prevent="teamDialogOpen">
        <input type="hidden" name="_token" :value="csrf" />

        <VRow align="center" justify="center">
          <VCard class="mx-auto">
            <VCardTitle class="blue">
              <VListGroup>
                <VListGroupItem>
                  <VListGroupItemAction start>
                    <VIcon>mdi-upload</VIcon>
                  </VListGroupItemAction>
                  <VListGroupItemContent>
                    <VListGroupItemTitle class="headline white--text">簡易アップロード(チームデータ)</VListGroupItemTitle>
                    <VListGroupItemSubtitle class="white--text">ユーザー登録無しでチームデータのアップロード可能</VListGroupItemSubtitle>
                  </VListGroupItemContent>
                </VListGroupItem>
              </VListGroup>
            </VCardTitle>

            <VCol cols="12" md="12">
              <VTextField
                v-model="ownerName"
                :error-messages="ownerNameError"
                label="オーナー名"
                prepend-icon="mdi-account-circle"
              ></VTextField>

              <VTextarea
                v-model="comment"
                :error-messages="commentError"
                label="コメント"
                prepend-icon="mdi-comment-multiple-outline"
              ></VTextarea>

              <VCombobox
                v-model="searchTag"
                :items="itemTeam"
                label="検索タグ"
                multiple
                chips
                prepend-icon="mdi-tag-plus"
              ></VCombobox>

              <VTextField
                v-model="deletePassword"
                :error-messages="deletePasswordError"
                label="削除パスワード"
                type="password"
                prepend-icon="mdi-lock"
              ></VTextField>

              <VFileInput
                label="チームデータ"
                v-model="teamFile"
                prepend-icon="mdi-file-upload"
                :show-size="true"
                @change="handleFileSelected($event.target.files?.item(0))"
              ></VFileInput>

              <VTextField
                v-model="teamDownloadableAt"
                label="ダウンロード可能日時"
                type="datetime-local"
                prepend-icon="mdi-calendar-clock"
              ></VTextField>
            </VCol>

            <VCardActions class="justify-center">
              <VBtn large block class="primary" type="submit">チームデータアップロード</VBtn>
            </VCardActions>
          </VCard>
        </VRow>
      </VForm>
    </VCol>
  </VContainer>
</template>
