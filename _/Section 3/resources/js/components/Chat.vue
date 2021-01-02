<template>
  <div>
    <v-list>
      <template v-for="message in messages">
        <v-list-tile
          :key="message.id"
        >
          <v-list-tile-content>
            <v-list-tile-sub-title v-html="message.text"></v-list-tile-sub-title>
            <v-divider />
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>

    <v-container>
      <v-form
        v-model="valid"
        ref="chatForm"
      >
        <v-text-field
          v-model="text"
          :rules="textRules"
          label="Message"
          @keyup.enter.native="send"
          required
        />
        <v-btn
          @click="send"
          :disabled="!valid"
        >
          Send
        </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'chat',
  data: () => ({
    valid: false,
    text: '',
    textRules: [
      v => !!v || 'Message is required',
    ]
  }),
  computed: {
    messages: function() {
      return this.$store.state.chatMessages;
    }
  },
  methods: {
    send: function() {
      if (this.valid) {
        this.$store.dispatch('CHAT_MESSAGE_SEND', this.text).then(() => {
          this.$refs.chatForm.reset();
        });
      }
    }
  }
};
</script>

<style scoped>
.message {
  margin: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  background: #eee;
  border-radius: 5px;
}

.send-btn {
  float: right;
  margin-top: 0.5em;
}
</style>
