import Vue from 'vue';
import Vuex from 'vuex';
import Price from '../structure/Price';
import Stack from '../structure/Stack';
import Utils from '../utils/Utils';
import Animal from '../const/Animal';

Vue.use(Vuex);

const state = {
  connectChatRoom: false,
  connectPriceGrid: false,
  messages: [],
  user: {
    uuid: null,
    sourceId: 1,
    avatar: null,
    code: null,
    name: null,
    color: null,
    currency: 'USD',
    realtimeMode: true,
  },
  sources: {
    '1': {
      data: new Stack(),
      historical: {
        data: [],
      },
    },
    '2': {
      data: new Stack(),
      historical: {
        data: [],
      },
    },
    '3': {
      data: new Stack(),
      historical: {
        data: [],
      },
    },
  },
};

const getters = {
  user: state => {
    return state.user;
  },
  sourceId: state => {
    return state.user.sourceId;
  },
  prices: state => {
    let result = state.sources[state.user.sourceId];
    return result.data.stack !== [] ? result.data.stack : Stack.EMPTY_STACK;
  },
  lastPrice: state => {
    let result = state.sources[state.user.sourceId];
    return result.data.top;
  },
  messages: state => {
    return state.messages;
  },
  connectChatRoom: state => {
    return state.connectChatRoom;
  },
  realtimeMode: state => {
    return state.user.realtimeMode;
  },
};

const mutations = {
  toggleChatRoom: (state, toggle) => {
    state.connectChatRoom = toggle;
  },
  changeSource: (state, sourceId) => {
    if (state.user.sourceId !== sourceId) {
      state.user.sourceId = sourceId;
    }
  },
  toggleRealtimeMode: state => {
    state.user.realtimeMode = !state.user.realtimeMode;
  },
  push: (state, last) => {
    let result = state.sources[state.user.sourceId];
    if (result !== null) {
      result.data.push(new Price(last.time, last.price));
    }
  },
  addMessage: (state, message) => {
    state.messages.push(message);
  },
  init: state => {
    let user = Utils.getStorage('user');
    if (user === null) {
      let index = Math.floor(Math.random() * Animal.length);
      let animal = Animal.get(index);
      let user = {};
      user.realtimeMode = true;
      user.sourceId = 1;
      user.currency = 'USD';
      user.uuid = Utils.generateUUID();
      user.code = animal.code;
      user.color = Utils.randomColor();
      user.avatar = Utils.getAvatar(animal.filename);
      user.name = animal.name;
      state.user = user;
      Utils.setStorage('user', user);
    } else {
      state.user = user;
    }
  },
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  strict: true,
});
