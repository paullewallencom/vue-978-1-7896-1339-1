<template>
  <v-app dark>
    <v-toolbar
      color="red"
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">You News</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          v-model="search"
          placeholder="Search..."
          single-line
          solo-inverted
          append-icon="search"
          color="white"
          hide-details
        ></v-text-field>
      </v-layout>
    </v-toolbar>
    <feed-list
      :show="drawer"
    />
    <nuxt/>
  </v-app>
</template>

<script>
import FeedList from '@/components/FeedList';

export default {
  name: 'layout',
  components: {
    FeedList,
  },
  data() {
    return {
      drawer: true,
      search: ''
    };
  },
  watch: {
    search(val) {
      this.$store.dispatch('SEARCH', val);
    },
  }
}
</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
