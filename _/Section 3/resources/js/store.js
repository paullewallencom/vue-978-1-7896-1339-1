import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

Vue.use(Vuex);
Vue.use(VueResource);

const store = new Vuex.Store({
  state: {
    photos: [],
    selectedPhoto: null,
    comments: [],
    chatMessages: [],
  },
  mutations: {
    PHOTOS_SET(state, photos) {
      state.photos = photos;
    },
    SELECTED_PHOTO_SET(state, photo) {
      state.selectedPhoto = photo;
    },
    COMMENTS_SET(state, comments) {
      state.comments = comments;
    },
    CHAT_MESSAGES_SET(state, messages) {
      state.chatMessages = messages;
    }
  },
  actions: {
    CHAT_GET({ commit }) {
      return Vue.http.get('/api/chat').then(({ body }) => {
        commit('CHAT_MESSAGES_SET', body);
      });
    },
    PHOTOS_GET({ commit }) {
      return Vue.http.get('/api/photo').then(({ body }) => {
        commit('PHOTOS_SET', body);
      });
    },
    COMMENTS_GET({ commit }, photoId) {
      return Vue.http.get(`/api/photo/${photoId}/comment`).then(({ body }) => {
        commit('COMMENTS_SET', body);
      });
    },
    PHOTO_SELECT({ state, commit, dispatch }, photoId) {
      return dispatch('PHOTOS_GET').then(() => {
        state.photos.forEach(p => {
          if (p.id === parseInt(photoId)) {
            commit('SELECTED_PHOTO_SET', p);
          }
        });
        dispatch('COMMENTS_GET', photoId);
      });
    },
    CHAT_MESSAGE_SEND(context, text) {
      return Vue.http.post('/api/chat', {
        text,
      });
    },
    COMMENT_POST({ state }, { title, text } ) {
      return Vue.http.post(`/api/photo/${state.selectedPhoto.id}/comment`, {
        title,
        text,
        pubDate: new Date(),
      });
    },
  }
});

store.dispatch('PHOTOS_GET');
store.dispatch('CHAT_GET');

export default store;
