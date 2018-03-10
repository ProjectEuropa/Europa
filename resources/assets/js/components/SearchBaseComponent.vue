<template>
    <div>
    </div>
</template>

<script>
import SearchFilter from "./SearchFilterComponent";

export default {
  components: {
    SearchFilter
  },
  data() {
    return {
      files: [],
      current_page: 0,
      last_page: 0,
      total: 0,
      from: 0,
      to: 0,
      page_range: 10,
      csrf: myToken.csrfToken,
      first_page_url: "",
      last_page_url: "",
      next_page_url: "",
      prev_page_url: "",
      path: "",
      search_type: document.getElementById("search-type").value,
      keyword: "",
      order_type: "desc"
    };
  },
  computed: {
    displayPageRange() {
      const half = Math.ceil(this.page_range / 2);
      let start, end;

      if (this.last_page < this.page_range) {
        start = 1;
        end = this.last_page;
      } else if (this.current_page < half) {
        start = 1;
        end = start + this.page_range - 1;
      } else if (this.last_page - half < this.current_page) {
        end = this.last_page;
        start = end - this.page_range + 1;
      } else {
        start = this.current_page - half + 1;
        end = this.current_page + half;
      }

      let indexes = [];
      for (let i = start; i <= end; i++) {
        indexes.push(i);
      }
      return indexes;
    }
  },
  methods: {
    searchFunction(keyword, order_type) {
      this.keyword = keyword;
      this.order_type = order_type;
      this.pagenate(this.path + "?ordertype=" + this.order_type + "&keyword=" + this.keyword);
    },
    getLinkFile: function(id) {
      return "/search/download/" + id;
    },
    nl2br(value) {
      return value !== null ? value.replace(/\n/g, "<br>") : "";
    },
    pageSelect(i) {
      this.pagenate(this.path + "?page=" + String(i) + "&ordertype=" + this.order_type + "&keyword=" + this.keyword);
    },
    pagenate(url) {
      const spinHandle = loadingOverlay().activate();
      setTimeout(() => {loadingOverlay().cancel(spinHandle)}, 2000);
      axios.get(url).then(res => {
        this.files = res.data.data;
        this.current_page = res.data.current_page;
        this.last_page = res.data.last_page;
        this.total = res.data.total;
        this.from = res.data.from;
        this.to = res.data.to;
        this.first_page_url = res.data.first_page_url;
        this.last_page_url = res.data.last_page_url;
        this.next_page_url = res.data.next_page_url;
        this.prev_page_url = res.data.prev_page_url;
        this.path = res.data.path;
        window.scrollTo(0, 0);
      });
    },
    openConfirmDialog(file_name, file_id) {
      document.getElementById("confirm-dialog").showModal();
      document.getElementById("delete-file-name").innerText = file_name;
      document.getElementById("delete-form-id").value = file_id;
    },
    dialogClose() {
      document.getElementById("confirm-dialog").close();
    },
    submitDelete() {
      document.getElementById(String(document.getElementById("delete-form-id").value)).submit();
      document.getElementById('submit-delete').disabled = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.alert {
  padding: 0;
}
.table-header {
  .download,
  .owner {
    width: 120px;
  }
  .created-at {
    width: 160px;
  }
  .delete {
    width: 200px;
  }
  .sumdownload {
    width: 130px;
  }
  label {
    margin: 0;
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