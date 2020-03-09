<template>
  <div class="chart-container">
    <div
      class="modal fade"
      id="historicalModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="historicalModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="historicalModalLabel">Oops!!</h5>
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
            <p>目前來源{{ sourceId }} 沒有今日的歷史價格資訊</p>
          </div>
        </div>
      </div>
    </div>
    <canvas id="historicalChart"></canvas>
  </div>
</template>
<script>
import Store from '../store';
import Chart from 'chart.js';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';

let chart;

export default {
  watch: {
    sourceId() {
      this.update();
    },
    realtimeMode() {
      this.update();
    },
  },
  computed: {
    sourceId: () => Store.getters.sourceId,
    realtimeMode: () => Store.getters.realtimeMode,
  },
  methods: {
    update() {
      let sourceId = this.sourceId;
      let currentTime = moment().startOf('day');
      axios
        .get(
          `http://localhost:8080/api/historical/price?id=${sourceId}&start=${currentTime /
            1000}`
        )
        .then(response => {
          let data = response.data.response;
          if (data.length === 0) {
            $('#historicalModal').modal('show');
          }
          chart.data.datasets[0].data = data.map(d => {
            return {
              x: d.time,
              y: d.price,
            };
          });
          chart.update();
        });
    },
  },
  mounted() {
    let ctx = document.getElementById('historicalChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: [],
          },
        ],
      },
      options: {
        plugins: {
          streaming: false,
        },
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH點',
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                callback: function(value) {
                  return '$' + value;
                },
              },
            },
          ],
        },
      },
    });
    this.update();
  },
};
</script>

<style scoped>
.chart-container {
  height: 50vh;
}
</style>
