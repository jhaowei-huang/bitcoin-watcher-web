<template>
  <div>
    <div
      class="modal fade"
      id="errorModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="errorModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="errorModalLabel">Oops!! 發生錯誤</h5>
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

    <table class="table">
      <thead>
        <tr>
          <th scope="col">時間</th>
          <th scope="col">價格</th>
          <th scope="col">變化</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="price in items" v-bind:key="price.id">
          <td>{{ price.time }}</td>
          <td>{{ price.price }}</td>
          <td
            v-bind:style="{ color: diffStyle(price.diff), fontWeight: 'bold' }"
          >
            {{ diffValue(price.diff) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Store from '../store';
import Utils from '../utils/Utils';
import WebSocket from '../utils/WebSocket';
import axios from 'axios';
import $ from 'jquery';

export default {
  data() {
    return {
      diffStyle(n) {
        if (n > 0) {
          return 'green';
        }
        if (n < 0) {
          return 'red';
        }
        return 'black';
      },
      diffValue(n) {
        let v = Utils.round(n);
        if (v > 0) {
          return '+' + v;
        }
        if (n <= 0) {
          return v;
        }
      },
      errors() {
        return [];
      },
    };
  },
  name: 'PriceGrid',
  watch: {
    sourceId() {
      this.connect();
    },
  },
  computed: {
    sourceId() {
      return Store.getters.sourceId;
    },
    items() {
      return Store.getters.prices.map((p, i, a) => {
        return {
          price: p.price,
          time: Utils.formatTimeString(p.time),
          diff:
            a[i + 1] === undefined ? '' : Utils.round(p.price - a[i + 1].price),
        };
      });
    },
  },
  methods: {
    connect() {
      let sourceId = Store.getters.sourceId;
      WebSocket.subscribe('/topic/price/' + sourceId, frame => {
        let data = JSON.parse(frame.body);
        Store.commit('push', data);
      });
    },
  },
  mounted() {
    this.subscribe.$on('subscribe', this.connect);
    let sourceId = Store.getters.sourceId;
    let that = this;
    axios
      .get(`http://localhost:8080/api/price?id=${sourceId}`)
      .then(response => {
        if (response.data.status) {
          Store.commit('push', response.data.response);
        } else {
          that.errors = response.data.response;
          $('#errorModal').modal('show');
        }
      });
  },
  props: ['subscribe'],
};
</script>
