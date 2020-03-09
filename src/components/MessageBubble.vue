<template>
  <div class="message-row">
    <img
      class="message-avatar"
      style="width: 8%; height: 8%;"
      v-bind:src="getAvatar(message.code)"
      v-bind:style="'background-color:' + message.color + ';'"
      v-bind:alt="message.name"
    />
    <div class="message-box">
      <p class="message-name" :style="'color:' + message.color + ';'">
        {{ message.name }} 說：
      </p>
      <p class="message-content">
        {{ message.content }}
      </p>
      <span class="time_date">{{ formatTime(message.time) }}</span>
    </div>
  </div>
</template>
<script>
import Utils from '../utils/Utils';

export default {
  name: 'MessageBubble',
  data() {
    return {
      self: true,
    };
  },
  methods: {
    getAvatar: code => Utils.getAvatar(code + '.png'),
    formatTime: time => Utils.formatTimeString(time),
  },
  props: { message: Object },
};
</script>

<style scoped>
.message-name {
  font-size: 0.5rem;
  font-weight: bold;
  margin: 0 0 2px 0;
  float: top;
  text-align: left;
}

.message-row {
  display: inline-flex;
  vertical-align: top;
  width: 100%;
}

.message-box {
  display: block;
  margin-left: 10px;
}

.message-content {
  white-space: pre-wrap;
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 10px;
  color: #646464;
  font-size: 14px;
  padding: 5px 10px 1px 12px;
  margin-bottom: 3px;
  text-align: left;
  width: 100%;
}

.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 0 0 10px 4px;
  float: left;
}
</style>
