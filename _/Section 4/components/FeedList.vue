<template>
  <v-navigation-drawer
    v-model="show"
    fixed
    clipped
    app
  >
    <v-list dense>
      <v-list-tile v-for="feed in feeds" :key="feed.id" @click="onSelectFeed(feed.id)">
        <v-list-tile-action>
          <v-icon :color="iconColor(feed.id)">rss_feed</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title :class="feedTitleColor(feed.id)">
            {{ feed.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider v-if="showSearch"></v-divider>

      <v-list-tile @click="onShowSearch()" v-if="showSearch">
        <v-list-tile-action>
          <v-icon :color="searchIconColor()">search</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title :class="searchTitleColor()">
            Search results
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider />

      <add-feed-dialog />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import AddFeedDialog from '@/components/AddFeedDialog'

export default {
  components: {
    AddFeedDialog,
  },
  props: [ 'show' ],
  computed: {
    ...mapState([
      'feeds',
      'selectedFeed',
      'showSearch',
    ]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set() {
      }
    },
  },
  methods: {
    feedTitleColor(id) {
      return this.$store.state.selectedFeed === id ? '' : 'grey--text text--darken-1';
    },
    iconColor(id) {
      return this.$store.state.selectedFeed === id ? '' : 'grey darken-1';
    },
    searchTitleColor() {
      return this.$store.state.showSearch ? '' : 'grey--text text--darken-1';
    },
    searchIconColor() {
      return this.$store.state.showSearch ? '' : 'grey darken-1';
    },
    onSelectFeed(id) {
      this.$store.dispatch('FEED_SELECT', id)
    },
  },
}
</script>
