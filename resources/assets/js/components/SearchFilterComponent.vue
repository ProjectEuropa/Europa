<template>
    <div class="container">
        <div class="form-inline">
            <label for="keyword">検索ワード： </label>
            <div class="md-form form-group">
                <input type="text" class="input-alternate" @keyup.enter="search" placeholder="" v-model="keyword">
            </div>
            <div class="md-form form-group">
                <select id="ordertype" class="form-control" name="ordertype" v-model="order_type">
                    <option value="desc">投稿日時の新しい順</option>
                    <option value="asc">投稿日時の古い順</option>
                </select>
            </div>
            <div class="md-form form-group">
                <a class="btn btn-info" @click="search">検索</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
        keyword: '',
        order_type: 'desc'
    };
  },
  methods : {
    search(){
        this.$emit('call-parent-search', this.keyword, this.order_type);
    }
  },
};
</script>

<style lang="scss" scoped>
.form-inline {
    margin-left: -15px;
    margin-top: -15px;
    select {
        background-color: white;
        margin-top: 15px;
    }
    .btn-info {
        margin-top: 20px;
    }
}
</style>

