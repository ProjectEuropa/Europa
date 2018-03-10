<template>
    <div>
        <search-filter v-on:call-parent-search="searchFunction"></search-filter>
        <div class="table-number">{{ total }}件中 {{ from }} 〜 {{ to }}件</div>
        <div class="row table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr class="table-header">
                        <th class="download">ダウンロード</th>
                        <th class="owner">オーナー名</th>
                        <th>コメント</th>
                        <th>ファイル名</th>
                        <th class="created-at">アップロード日時</th>
                        <th class="delete">削除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in files" :key="file.id">
                        <td>
                            <a :href="getLinkFile(file.id)">
                                <i class="fa fa-cloud-download" aria-hidden="true"></i>
                            </a>
                        </td>
                        <td>{{ file.upload_owner_name }}</td>
                        <td><div v-html="nl2br(file.file_comment)"></div>
                            <span v-if="file.search_tag1" class="alert alert-info"><i class="fa fa-search"></i>{{file.search_tag1}}</span>
                            <span v-if="file.search_tag2" class="alert alert-info"><i class="fa fa-search"></i>{{file.search_tag2}}</span>
                            <span v-if="file.search_tag3" class="alert alert-info"><i class="fa fa-search"></i>{{file.search_tag3}}</span>
                            <span v-if="file.search_tag4" class="alert alert-info"><i class="fa fa-search"></i>{{file.search_tag4}}</span>
                        </td>
                        <td>{{ file.file_name }}</td>
                        <td>{{ file.created_at }}</td>
                        <td>
                            <form method="post" :action="'/search/' + search_type + '/delete'" class="form-horizontal" v-if="file.upload_type == '2'" :id="file.id">
                                <div class="form-group">
                                    <div class="form-inline">
                                        <input type="password" class="input-alternate" name="deletePassword" placeholder="削除パスワード" @keyup.enter="openConfirmDialog(file.file_name, file.id)">
                                        <input type="hidden" name="id" class="form-control" :value="file.id">
                                        <button type="button" class="btn btn-info btn-delete" @click="openConfirmDialog(file.file_name, file.id)">削除</button>
                                    </div>
                                </div>
                                <input type="hidden" name="_token" :value="csrf">
                                <input name="_method" type="hidden" value="DELETE">
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-left">
            <nav class="my-4 pt-2">
                <ul class="pagination pagination-circle mb-0">
                    <li class="page-item clearfix d-none d-md-block" @click="pagenate(first_page_url + '&ordertype=' + order_type + '&keyword=' + keyword )">
                        <a class="page-link waves-effect waves-effect">First</a>
                    </li>
                    <li :class="[{disabled: prev_page_url === null}, 'page-item']">
                        <a :class="[{disabled: prev_page_url === null}, 'page-link waves-effect waves-effect']" aria-label="Previous" @click="pagenate(prev_page_url + '&ordertype=' + order_type + '&keyword=' + keyword)">
                            <span aria-hidden="true">«</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    <li
                        v-for="i in displayPageRange"
                        :class="[{active: i === current_page}, 'page-item']" :key="i">
                        <a @click="pageSelect(i)" class="page-link waves-effect waves-effect">{{ i }}</a>
                    </li>
                    <li :class="[{disabled: next_page_url === null}, 'page-item']">
                        <a :class="[{disabled: next_page_url === null}, 'page-link waves-effect waves-effect']" aria-label="Next"  @click="pagenate(next_page_url + '&ordertype=' + order_type + '&keyword=' + keyword)">
                            <span aria-hidden="true">»</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                    <li class="page-item clearfix d-none d-md-block">
                        <a class="page-link waves-effect waves-effect" @click="pagenate(last_page_url + '&ordertype=' + order_type + '&keyword=' + keyword)">Last</a>
                    </li>
                </ul>
            </nav>
        </div>
        <dialog id="confirm-dialog" @click.stop>
            <p>本当に「<span id="delete-file-name"></span>」を削除しますか？</p>
            <input type="hidden" id="delete-form-id" value="">
            <menu>
              <button id="cancel" class="btn btn-info" @click="dialogClose">キャンセル</button>
              <button type="button" id="submit-delete" class="btn btn-danger" @click="submitDelete">削除する</button>
            </menu>
        </dialog>
    </div>
</template>

<script>
import SearchBase from "./SearchBaseComponent";

export default {
  mixins:[
    Vue.extend(SearchBase)
  ],
  mounted() {
    this.pagenate("/api/search/" + this.search_type);
  },
};
</script>

<style lang="scss" scoped>
.alert {
  padding: 0;
}
.table-header {
  .download,
  .owner {
    width: 100px;
  }
  .created-at {
    width: 160px;
  }
  .delete {
    width: 200px;
  }
}
dialog:not([open]) {
  display: none;
}
dialog {
  border: none;
  menu {
    padding: 0;
    margin: 0;
  }
  p {
    text-align: center;
  }
}
@media screen and (max-width: 767px) {
  table {
    overflow: auto;
    white-space: nowrap;
  }
}
</style>

