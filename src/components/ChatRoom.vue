<template>
  <div>
    <!-- modal -->
    <div
      class="modal fade"
      id="chatroomModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="chatroomModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="chatroomModalLabel">
              Oops!!無法發送訊息
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p v-for="error in errors" v-bind:key="error">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- message box -->
    <div class="messaging">
      <div class="inbox_msg">
        <div class="mesgs">
          <div class="msg_history">
            <MessageBubble
              v-for="m in chatMessages"
              v-bind:message="m"
              v-bind:key="m.id"
            ></MessageBubble>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <textarea
                class="write_msg"
                placeholder="請輸入訊息, shift + enter 換行, enter 送出訊息"
                rows="1"
                v-on:keydown.stop.enter="sendMessage"
                @compositionstart="compositionstart"
                @compositionend="compositionend"
              />
              <button
                class="btn btn-primary msg_send_btn"
                v-on:click="sendMessage"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Store from '../store';
import MessageBubble from './MessageBubble';
import WebSocket from '../utils/WebSocket';
import $ from 'jquery';

export default {
  connect() {},
  name: 'ChatRoom',
  components: { MessageBubble },
  data() {
    return {
      input: true,
      errors: ['超過60字 GG'],
    };
  },
  computed: {
    connectChatRoom() {
      return Store.getters.connectChatRoom;
    },
    chatMessages() {
      return Store.getters.messages;
    },
  },
  methods: {
    sendMessage(e) {
      if (e.shiftKey) {
        return true;
      }
      e.preventDefault();
      if (!this.input) return false;
      let element = document.getElementsByClassName('write_msg')[0];
      let message = element.value.trim();
      if (message === '' || message === null) return false;
      let user = Store.getters.user;
      element.value = '';
      element.rows = '1';
      WebSocket.send({
        uuid: user.uuid,
        code: user.code,
        color: user.color,
        name: user.name,
        content: message.trim(),
      });
      return false;
    },
    compositionstart() {
      this.input = false;
    },
    compositionend() {
      this.input = true;
    },
    addMessage(message) {
      this.chatMessages.push(message);
    },
    connect() {
      WebSocket.subscribe('/topic/chat', response => {
        Store.commit('addMessage', JSON.parse(response.body).response);
        let box = document.getElementsByClassName('msg_history')[0];
        box.scrollTop = box.scrollHeight;
      });
      let that = this;
      WebSocket.subscribe('/user/topic/chat', response => {
        that.errors = Object.values(JSON.parse(response.body).response);
        $('#chatroomModal').modal('show');
      });
    },
  },
  mounted() {
    this.subscribe.$on('subscribe', this.connect);
  },
  props: ['subscribe'],
};
</script>
<style scoped>
.inbox_msg {
  clear: both;
  overflow: hidden;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}

.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 100%;
}

.input_msg_write textarea {
  resize: none;
  overflow: hidden;
  display: inline-flex;
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  max-height: 240px;
  width: 100%;
  outline: none;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
  margin-bottom: 10px;
}

.msg_send_btn {
  position: absolute;
  right: 0;
  top: 11px;
}

.msg_send_btn:hover {
  transform: scale(1.1);
}

.msg_send_btn:active {
  transform: translate(0px, 3px);
  -webkit-transform: translate(0px, 3px);
  box-shadow: 0 1px 0 0;
}

.messaging {
  padding: 0 0 50px 0;
}

.msg_history {
  min-height: 250px;
  max-height: 250px;
  overflow-y: scroll;
}
</style>
