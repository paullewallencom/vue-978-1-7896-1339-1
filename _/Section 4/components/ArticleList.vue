<template>
  <v-content>
    <v-data-table
      :headers="headers"
      :items="articles"
      item-key="name"
      hide-actions
      class="articles"
    >
      <template slot="items" slot-scope="props">
        <tr @click="onArticleClick(props.item)">
          <td>{{ props.item.pubDate | date }}</td>
          <td>{{ props.item.title }}</td>
        </tr>
      </template>
    </v-data-table>

    <div
      v-html="selectedArticle"
      class="content"
    />
  </v-content>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  filters: {
    date(value) {
      if (!value) return '';
      return moment(value).fromNow()
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Date',
          align: 'left',
          sortable: true,
          value: 'pubDate'
        },
        {
          text: 'Title',
          align: 'left',
          sortable: true,
          value: 'title'
        },
      ]
    };
  },
  computed: {
    ...mapState(['articles']),
    selectedArticle() {
      return this.$store.state.selectedArticle ? 
        this.$store.state.selectedArticle.content : ''
    },
  },
  methods: {
    onArticleClick(article) {
      this.$store.commit('ARTICLE_SELECT', article)
    },
  },
}
</script>

<style scoped>
.articles {
  overflow-y: scroll;
  height: 25vh;
}

.content {
  padding: 10px;
  height: 100%;
  background: white;
  color: black;
  font-size: x-large;
}
</style>
