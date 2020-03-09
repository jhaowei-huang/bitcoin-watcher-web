import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Store from '../store';

function onError(error) {
  console.log(error);
}

class WebSocket {
  constructor() {
    this._socket = null;
    this._stompClient = null;
    this._isConnected = false;
  }

  static send(payload) {
    if (this._stompClient && this._stompClient.connected) {
      this._stompClient.send('/send/chat', {}, JSON.stringify(payload));
    }
  }

  static async connect(callback = null) {
    this._socket = new SockJS('http://localhost:8080/bitcoin');
    this._stompClient = Stomp.over(this._socket);
    // disable debug
    this._stompClient.debug = null;
    let that = this;
    await this._stompClient.connect(
      {},
      () => {
        that._isConnected = true;
        if (callback !== null) {
          callback();
        }
        Store.commit('toggleChatRoom', true);
      },
      error => {
        onError(error);
        that._isConnected = false;
      }
    );
  }

  static disconnect() {
    if (this._stompClient) {
      this._stompClient.disconnect();
    }
    this._isConnected = false;
  }

  static isConnected() {
    return this._isConnected;
  }

  static unsubscribe(topic) {
    this._stompClient.unsubscribe(topic);
  }

  static subscribe(topic, callback, header = null) {
    this._stompClient.subscribe(topic, callback, header);
  }
}

export default WebSocket;
