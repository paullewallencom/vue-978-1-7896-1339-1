import VueRouter from 'vue-router';
import moment from 'moment';
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'

import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import Chat from './components/Chat';

import Layout from './layout/Layout';

import store from './store';

require('./bootstrap');

window.Vue = require('vue');

Vue.use(Vuetify)
Vue.use(VueRouter)

Echo.channel('photo').listen('.new', function() {
  store.dispatch('PHOTOS_GET');
});

Echo.channel('comment').listen('.newComment', function({ comment }) {
  store.dispatch('COMMENTS_GET', comment.photo_id);
});

Echo.channel('chat').listen('.newMessage', function() {
  store.dispatch('CHAT_GET');
});

store.dispatch('CHAT_GET');

Vue.component('chat', Chat);
Vue.component('layout', Layout);

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: DetailPage,
  }
];
const router = new VueRouter({
  routes,
});

Vue.filter('formatDate',
  value => value ? moment(String(value)).fromNow() : ''
);

const app = new Vue({
  router,
  store,
}).$mount('#app');
