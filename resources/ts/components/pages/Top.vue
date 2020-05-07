<template>
  <v-parallax dark :src="require('../../../images/Europa.jpg')" style="height: 100%;">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="display-1 font-weight-bold mb-4 cyan--text text--darken-1">Welcome to Europa</h1>
        <h4 class="subheading">Carnage Heart EXA 非公式アップローダーEuropaにようこそ</h4>
        <br />
        <h4 class="subheading">
          This image of copyright belong to
          <a href="https://creativecommons.jp/">creative commons JAPAN.</a>
        </h4>
      </v-col>
    </v-row>
  </v-parallax>
</template>

<style>
.v-parallax__image {
  transform: translate(-50%, 0px) !important;
}
</style>
