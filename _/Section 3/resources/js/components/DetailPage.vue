<template>
 <div>
    <div>
      <v-img
        :src="imagePath(photo.filePath)"
      />
    </div>

    <h1>Comments</h1>

    <v-list three-line>
      <template v-for="comment in comments">
        <v-list-tile
          :key="comment.id"
        >
          <v-list-tile-content>
            <v-list-tile-title v-html="comment.title"></v-list-tile-title>
            <v-list-tile-sub-title v-html="comment.text"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>{{ comment.pubDate | formatDate }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>

    <v-container>
      <v-form
        v-model="valid"
        ref="commentForm"
      >
        <v-text-field
          v-model="title"
          :rules="titleRules"
          label="Title"
          required
        />
        <v-textarea
          v-model="text"
          :rules="textRules"
          label="Comment"
          required
        />
        <v-btn
          @click="postComment"
          :disabled="!valid"
        >
          Submit Comment
        </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import store from '../store'

export default {
  name: "detail",
  beforeRouteEnter(to, from, next) {
    store.dispatch("PHOTO_SELECT", to.params.id).then(() => {
      next()
    });
  },
  data: () => ({
    valid: false,
    title: '',
    titleRules: [
      v => !!v || 'Title is required',
    ],
    text: '',
    textRules: [
      v => !!v || 'Comment is required',
    ]
  }),
  computed: {
    photo() {
      return this.$store.state.selectedPhoto
    },
    comments() {
      return this.$store.state.comments
    }
  },
  methods: {
    imagePath(filePath) {
      return `/storage/${filePath}`;
    },
    postComment() {
      this.$store
        .dispatch('COMMENT_POST', {
          title: this.title,
          text: this.text
        })
        .then(() => {
          this.$refs.commentForm.reset()
        });
    }
  },
};
</script>

<style scoped>
.title {
  margin-top: 0.5em;
  font-weight: bold;
  font-size: 14pt;
}
.text {
  margin-top: 0.5em;
  font-size: 14pt;
}
.date {
  text-align: right;
  font-size: 9pt;
  font-style: italic;
}
.comment-button {
  margin-top: 0.5em;
}
.comment-text {
  margin-top: 0.5em;
}
.comment-section {
  margin-top: 1em;
}
</style>
