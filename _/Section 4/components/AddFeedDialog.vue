<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <v-list-tile class="mt-3" slot="activator">
      <v-list-tile-action>
        <v-icon>add_circle_outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Add Feed</v-list-tile-title>
    </v-list-tile>

    <v-card>
      <v-card-title
        class="headline"
        primary-title
      >
        Add A Feed
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="feedName"
            :rules="feedNameRules"
            label="Name"
            required
          />
          <v-text-field
            v-model="feedUrl"
            :rules="feedUrlRules"
            label="RSS URL"
            required
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :disabled="!valid"
          flat
          @click="onAddFeed"
        >
          Add
        </v-btn>
        <v-btn
          flat
          @click="dialog = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    valid: false,
    feedUrl: '',
    feedUrlRules: [
      v => !!v || 'URL is required',
    ],
    feedName: '',
    feedNameRules: [
      v => !!v || 'Name is required',
    ]
  }),
  methods: {
    onAddFeed() {
      if (this.valid) {
        this.$store.dispatch('FEED_ADD', {
          name: this.feedName,
          url: this.feedUrl
        })
        this.dialog = false
      }
    },
  },
}
</script>
