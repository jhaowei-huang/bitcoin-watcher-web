<template>
  <div>
    <NavBar></NavBar>
    <div class="container-fluid">
      <div class="row mt-5">
        <div class="col-5">
          <PriceGrid v-bind:subscribe="subscribePriceGrid"></PriceGrid>
        </div>
        <div class="col-7">
          <ChatRoom
            style="{position: relative;}"
            v-bind:subscribe="subscribeChatRoom"
          ></ChatRoom>
        </div>
      </div>
      <div class="row" style="margin-top: -3.5rem;">
        <div class="col-12">
          <RealTimeChart
            v-if="realtimeMode"
            v-bind:chartData="chartData"
          ></RealTimeChart>
          <HistoricalChart v-else></HistoricalChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Store from '../store';
import NavBar from '../components/NavBar';
import PriceGrid from '../components/PriceGrid';
import ChatRoom from '../components/ChatRoom';
import WebSocket from '../utils/WebSocket';
import RealTimeChart from '../components/RealTimeChart';
import HistoricalChart from '../components/HistoricalChart';

export default {
  name: 'Home',
  components: {
    HistoricalChart,
    RealTimeChart,
    ChatRoom,
    PriceGrid,
    NavBar,
  },
  computed: {
    user: () => Store.getters.user,
    chartData: () => Store.getters.prices,
    realtimeMode: () => Store.getters.realtimeMode,
  },
  data() {
    return {
      subscribeChatRoom: new Vue(),
      subscribePriceGrid: new Vue(),
    };
  },
  methods: {
    async subscribe() {
      await this.subscribeChatRoom.$emit('subscribe');
      await this.subscribePriceGrid.$emit('subscribe');
    },
  },
  created() {
    Store.commit('init');
    WebSocket.connect(this.subscribe);
  },
};
</script>
