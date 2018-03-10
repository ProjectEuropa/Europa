<template>
    <div>
        <search-filter v-on:call-parent-search="searchFunction"></search-filter>
        <div class="table-number">{{ total }}件中 {{ from }} 〜 {{ to }}件</div>
        <div class="row table-responsive">
            <form method="post" action="/sumdownload/download" v-on:submit.prevent="loading" id="sumdl-submit">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="table-header">
                            <th class="sumdownload"><label><input type="checkbox" @click="allCheck" id="parent-check">全チェック</label></th>
                            <th class="owner">オーナー名</th>
                            <th>コメント</th>
                            <th>ファイル名</th>
                            <th class="created-at">アップロード日時</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="file in files" :key="file.id">
                            <td>
                                <input type="checkbox" name="checkFileId[]" class="child-check" :value="file.id">
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
                        </tr>
                    </tbody>
                </table>
                <input type="hidden" name="_token" :value="csrf">
                <button type="submit" class="btn btn-info">一括ダウンロード</button>
            </form>
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
    </div>
</template>

<script>
import SearchBase from "./SearchBaseComponent";

export default {
  mixins: [Vue.extend(SearchBase)],
  methods: {
    allCheck() {
      const child_check = document.querySelectorAll(".child-check");
      child_check.forEach(element => {
        element.checked = document.getElementById("parent-check").checked;
      });
    },
    loading() {
      const spinHandle = loadingOverlay().activate();
      setTimeout(() => {
        loadingOverlay().cancel(spinHandle);
      }, 5000);
      document.getElementById('sumdl-submit').submit();
    },
  },
  mounted() {
    this.pagenate("/api/sumdownload/" + this.search_type);
  }
};
</script>



