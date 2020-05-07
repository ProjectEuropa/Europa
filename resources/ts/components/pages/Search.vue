<template>
  <v-content>
    <v-container fluid>
      <h1 class="display-1 mb-4 text--darken-1">Search {{capitalizeFirstLetter(searchType)}} Data</h1>
      <h4 class="subheading">{{ searchTypeJa }}データの検索が可能です</h4>
      <v-form class="d-flex justify-md-space-center justify-sm-space-between">
        <v-text-field
          v-model="keyword"
          label="Solo"
          @keyup.enter="onClickSearch()"
          placeholder="keyword"
          solo
        ></v-text-field>
        <v-select :items="items" v-model="orderType" solo></v-select>
        <v-btn class="primary" @click="onClickSearch()">Search</v-btn>
      </v-form>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">ダウンロード</th>
              <th class="text-left">オーナー名</th>
              <th class="text-left">コメント</th>
              <th class="text-left">ファイル名</th>
              <th class="text-left">アップロード日時</th>
              <th class="text-left">削除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in teams" :key="index">
              <td>
                <v-icon @click="download(item.id)">mdi-cloud-download-outline</v-icon>
              </td>
              <td>{{ item.upload_owner_name }}</td>
              <td>
                <div style="white-space:pre-wrap; word-wrap:break-word;">{{ item.file_comment }}</div>
                <span v-if="item.search_tag1" role="alert" class="theme--light search__tag">
                  <v-icon>mdi-magnify</v-icon>
                  {{ item.search_tag1 }}
                </span>
                <span v-if="item.search_tag2" role="alert" class="theme--light search__tag">
                  <v-icon>mdi-magnify</v-icon>
                  {{ item.search_tag2 }}
                </span>
                <span v-if="item.search_tag3" role="alert" class="theme--light search__tag">
                  <v-icon>mdi-magnify</v-icon>
                  {{ item.search_tag3 }}
                </span>
                <span v-if="item.search_tag4" role="alert" class="theme--light search__tag">
                  <v-icon>mdi-magnify</v-icon>
                  {{ item.search_tag4 }}
                </span>
              </td>
              <td>{{ item.file_name }}</td>
              <td>{{ item.created_at }}</td>
              <td>
                <v-icon v-if="item.upload_type === '2'" @click="dialogOpen(item.file_name, item.id)">mdi-delete-forever</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-pagination v-model="page" :length="pageLength"></v-pagination>
    </v-container>
    <delete-modal ref="dialog" :delObj="delObj"></delete-modal>
    <v-overlay :value="overlay">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-content>
</template>

<script lang="ts">
import { FileDataObject } from "../../vue-data-entity/FileDataObject";
import { SelectBoxTextValueObject } from "../../vue-data-entity/SelectBoxTextValueObject";
import { TargetDeleteFileObject } from "../../vue-data-entity/TargetDeleteFileObject";
import { FilePaginateObject } from "../../laravel-data-entity/FilePaginateObject";
import DeleteModal from "../modules/DeleteModal.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import VueRouter from "vue-router";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

Component.registerHooks(["beforeRouteUpdate"]);
@Component({
  components: {
    DeleteModal
  }
})
export default class SearchTeam extends Vue {
  teams: Array<FileDataObject> = [];
  keyword: string | (string | null)[] = "";
  page: number = 1;
  items: Array<SelectBoxTextValueObject> = [
    {
      text: "投稿日時の新しい順",
      value: "1"
    },
    {
      text: "投稿日時の古い順",
      value: "2"
    }
  ];
  orderType: string | (string | null)[] = "1";
  dialog: boolean = false;
  delObj: TargetDeleteFileObject = { id: 0, file_name: "" };
  overlay: boolean = false;
  pageLength: number = 1;
  searchType: string = "";
  searchTypeJa: string = "";

  $refs!: {
    dialog: DeleteModal;
  };

  /**
   * name
   */
  public dialogOpen(file_name: string, id: number) {
    this.delObj.file_name = file_name;
    this.delObj.id = id;
    this.$refs.dialog.open();
  }

  /**
   * name
   */
  public capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * name
   */
  public created() {
    this.searchType = this.$route.params.searchType;
    this.searchTypeJa = this.searchType === "team" ? "チーム" : "マッチ";
    this.search();
  }

  /**
   * watch
   */
  @Watch("page")
  onPageChanged() {
    this.$router
      .push({
        name: "Search",
        query: {
          page: this.page.toString(),
          keyword: this.keyword,
          orderType: this.orderType
        }
      })
      .catch(err => {});
  }

  /**
   * search
   */
  public onClickSearch() {
    this.$router
      .push({
        name: "Search",
        query: {
          keyword: this.keyword,
          orderType: this.orderType
        }
      })
      .catch(err => {});
  }

  /**
   * download
   */
  public download(id: number) {
    location.href = `/auto/download/${id}`;
  }

  /**
   * search
   */
  public search() {
    this.page = isNaN(Number(this.$route.query.page))
      ? 1
      : Number(this.$route.query.page);
    this.overlay = true;
    Vue.prototype.$http
      .get(
        `/api/search/${this.searchType}?page=${this.page}&keyword=${this.keyword}&orderType=${this.orderType}`
      )
      .then((res: AxiosResponse<FilePaginateObject>): void => {
        this.teams = res.data.data;
        this.pageLength = res.data.last_page;
        this.overlay = false;
      })
      .catch((error: AxiosError): void => {
        alert("検索実行時にエラーが発生しました");
        this.overlay = false;
      });
  }

  public beforeRouteUpdate(to: VueRouter, from: VueRouter, next: any) {
    next();
    this.searchType = this.$route.params.searchType;
    this.searchTypeJa = this.searchType === "team" ? "チーム" : "マッチ";
    this.search();
  }
}
</script>


<style>
.search__tag {
  padding: 5px;
  margin-right: 10px;
  border-radius: 5%;
  background-color: aliceblue;
}
</style>
