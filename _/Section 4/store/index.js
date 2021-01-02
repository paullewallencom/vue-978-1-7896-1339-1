import Vuex from 'vuex'
import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import VueResource from 'vue-resource'
import createPersistedState from 'vuex-persistedstate'

Vue.use(VueResource)

export default () => {
  const store = new Vuex.Store({
    strict: true,
    plugins: [createPersistedState({
      arrayMerger: (store, saved) => {
        return saved && saved.length > 0 ?
          saved.map(a => {
            if (a.pubDate) {
              a.pubDate = new Date(Date.parse(a.pubDate));
            }
            return a;
          }) : saved;
      },
    })],
    state: {
      drawer: true,
      feeds: [],
      selectedFeed: null,
      articles: [],
      selectedArticle: null,
      showSearch: false,
    },
    mutations: {
      SOCKET_ONOPEN(state, event) {},
      SOCKET_ONCLOSE (state, event) {},
      SOCKET_ONERROR (state, event) {},
      SOCKET_ONMESSAGE (state, message) {
        store.dispatch('FEEDS_GET').then(() => {
          if (state.selectedFeed) {
            store.dispatch('FEED_UPDATE', state.selectedFeed)
          }
        });
      },
      SOCKET_RECONNECT(state, count) {},
      SOCKET_RECONNECT_ERROR(state) {},
      FEEDS_SET(state, feeds) {
        state.feeds = feeds;
      },
      ARTICLES_SET(state, articles) {
        state.articles = articles.map(a => ({
          ...a,
          pubDate: new Date(Date.parse(a.pubDate)),
        }));
      },
      FEED_SELECT(state, feedId) {
        state.selectedFeed = feedId;
        state.showSearch = false;
      },
      ARTICLE_SELECT(state, article) {
        state.selectedArticle = article;
      },
      DRAWER_SET(state, drawer) {
        state.drawer = drawer;
      },
      SEARCH_SHOW(state) {
        state.selectedFeed = -1;
        state.showSearch = true;
      },
    },
    actions: {
      FEEDS_GET({ state, commit, dispatch }) {
        return Vue.http.get('/api/feeds').then(({ body }) => {
          commit('FEEDS_SET', body);
          if (body.length > 0 && !state.selectedFeed) {
            dispatch('FEED_SELECT', body[0].id);
          }
        });
      },
      FEED_SELECT({ commit }, feedId) {
        commit('FEED_SELECT', feedId);
        return Vue.http.get(`/api/feeds/${feedId}`).then(({ body }) => {
          commit('ARTICLES_SET', body);
          if (body.length > 0) {
            commit('ARTICLE_SELECT', body[0]);
          }
        });
      },
      SEARCH({ commit }, q) {
        return Vue.http.get(`/api/feeds/query`, { params: { q } }).then(({ body }) => {
          commit('ARTICLES_SET', body);
          commit('SEARCH_SHOW');
        });
      },
      FEED_UPDATE({ commit }, feedId) {
        return Vue.http.get(`/api/feeds/${feedId}`).then(({ body }) => {
          commit('ARTICLES_SET', body);
        });
      },
      FEED_ADD(context, {name, url}) {
        return Vue.http.post('/api/feeds', {
          name,
          url,
        });
      }
    }
  });

  store.dispatch('FEEDS_GET');
  
  Vue.use(VueNativeSock, 'ws://localhost:9999', {
    store,
  })

  return store;
};

