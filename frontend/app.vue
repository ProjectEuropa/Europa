<script setup>
import { ref } from 'vue'
const drawer = ref(false)
const items = [
  {
    title: 'Foo',
    value: 'foo',
  },
  {
    title: 'Bar',
    value: 'bar',
  },
  {
    title: 'Fizz',
    value: 'fizz',
  },
  {
    title: 'Buzz',
    value: 'buzz',
  },
]
</script>


<template>
  <v-card>
    <v-layout>
      <v-app-bar app clipped-left color="blue darken-3 white--text" class="main__blue">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>My files</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-magnify"></v-btn>

        <v-btn variant="text" icon="mdi-filter"></v-btn>

        <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="left" temporary>
        <v-list :items="items"></v-list>
      </v-navigation-drawer>

      <v-main style="">
        <v-card-text>
          The navigation drawer will appear from the bottom on smaller size screens.
        </v-card-text>
      </v-main>

      <v-footer app clipped-center color="blue darken-3 white--text" class="main__blue">
        <span>&copy; Team Project Europa 2016-{{new Date().getFullYear()}}</span>
      </v-footer>
    </v-layout>
  </v-card>
</template>

<style>
.main__blue {
  background-color: #1565c0!important;
  border-color: #1565c0!important;
  border-top-color: rgb(21, 101, 192) !important;
  border-right-color: rgb(21, 101, 192) !important;
  border-bottom-color: rgb(21, 101, 192) !important;
  border-left-color: rgb(21, 101, 192) !important;
}
</style>

