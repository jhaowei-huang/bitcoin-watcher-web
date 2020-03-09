<template>
  <nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
    <a class="navbar-brand" href="#">比特幣即時價格</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <span class="nav-link">資料來源</span>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="sourceDropDown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            來源 {{ user.sourceId }}
          </a>
          <div class="dropdown-menu" aria-labelledby="sourceDropDown">
            <a class="dropdown-item" href="#" v-on:click="changeSource(1)"
              >來源1</a
            >
            <a class="dropdown-item" href="#" v-on:click="changeSource(2)"
              >來源2</a
            >
            <a class="dropdown-item" href="#" v-on:click="changeSource(3)"
              >來源3</a
            >
          </div>
        </li>
        <li class="nav-item active">
          <span class="nav-link">幣別</span>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            id="currencyDropDown"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            BIT－{{ user.currency }}
          </a>
          <div class="dropdown-menu" aria-labelledby="currencyDropDown">
            <a class="dropdown-item" href="#">USD</a>
            <a class="dropdown-item" href="#">JPY</a>
            <a class="dropdown-item" href="#">TWD</a>
          </div>
        </li>
        <li class="nav-item active">
          <span class="nav-link">即時模式</span>
        </li>
        <label class="switch-wrap">
          <input
            type="checkbox"
            v-bind:checked="realtimeMode"
            v-on:click="changeMode"
          />
          <div class="switch"></div>
        </label>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <img v-bind:src="img" v-bind:alt="user.name" />
        </li>
        <li class="nav-item">
          <div class="name mt-2 mx-2">您好!! {{ user.name }}</div>
        </li>
        <li class="nav-item mt-1">
          <button class="btn btn-sm btn-danger" v-on:click="showAlert">
            更改
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import Store from '../store';
import WebSocket from '../utils/WebSocket';

export default {
  name: 'NavBar',
  watch: {
    sourceId(newValue, oldValue) {
      WebSocket.unsubscribe('/topic/price/' + oldValue);
    },
  },
  computed: {
    user: {
      get: () => Store.getters.user,
    },
    img: {
      get() {
        return this.user.avatar;
      },
    },
    realtimeMode: {
      get() {
        return Store.getters.realtimeMode;
      },
    },
    sourceId() {
      return Store.getters.sourceId;
    },
  },
  methods: {
    changeSource: sourceId => {
      Store.commit('changeSource', sourceId);
    },
    showAlert: () => alert('很抱歉！更改名字功能尚未實作！'),
    changeMode: () => {
      Store.commit('toggleRealtimeMode');
    },
  },
};
</script>
<style scoped>
.navbar {
  min-height: 20px;
}

.navbar-brand {
  padding: 0 15px;
  height: 20px;
  line-height: 20px;
}

img {
  width: 2rem;
  height: 2rem;
}

.name {
  font-weight: bold;
  color: white;
  cursor: default;
}

.btn-danger {
  outline: none;
}

.btn-danger:hover {
  transform: scale(1.1);
}

.btn-danger:active {
  transform: translate(0px, 3px);
  -webkit-transform: translate(0px, 3px);
  box-shadow: 0 1px 0 0;
}

/*switch*/

.switch-wrap {
  margin-left: 1rem;
  margin-top: 0.3rem;
  cursor: pointer;
  background: white;
  padding: 4px;
  width: 3rem;
  height: 1.8rem;
  border-radius: 33.5px;
}

.switch-wrap input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch {
  height: 100%;
  display: grid;
  grid-template-columns: 0 1fr 1fr;
  transition: 0.2s;
}

.switch::after {
  content: '';
  border-radius: 50%;
  background: #233862;
  grid-column: 2;
  transition: background 0.3s;
}

input:checked + .switch {
  grid-template-columns: 1fr 1fr 0fr;
}

input:checked + .switch::after {
  background-color: #52cf71;
}
</style>
