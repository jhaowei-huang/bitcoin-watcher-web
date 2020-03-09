<template>
  <div class="chart-container">
    <canvas id="myChart"></canvas>
  </div>
</template>
<script>
import Store from '../store';
import Chart from 'chart.js';
import 'chartjs-plugin-streaming';

export default {
  data() {
    return {
      historical: false,
      last: null,
      lastSourceId: null,
    };
  },
  computed: {
    sourceId() {
      return Store.getters.sourceId;
    },
  },
  mounted() {
    let ctx = document.getElementById('myChart').getContext('2d');
    let that = this;
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            data: [],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              type: 'realtime',
              time: {
                displayFormats: {
                  second: 'HH:mm:ss',
                },
              },
              realtime: {
                duration: 1000 * 60,
                refresh: 1000,
                pause: false,
                ttl: undefined,
                onRefresh: function(chart) {
                  if (
                    that.lastSourceId === null ||
                    that.sourceId() !== that.lastSourceId
                  ) {
                    that.isChanged = false;
                    chart.data.datasets[0].data = Store.getters.prices.map(
                      p => {
                        return {
                          x: p.time,
                          y: p.price,
                        };
                      }
                    );
                    return;
                  }
                  let lastPrice = Store.getters.lastPrice;
                  if (lastPrice && that.last !== lastPrice) {
                    let data = {
                      x: lastPrice.time,
                      y: lastPrice.price,
                    };
                    chart.data.datasets[0].data.push(data);
                    that.last = lastPrice;
                  }
                  // append the new data array to the existing chart data
                  // Array.prototype.push.apply(myChart.data.datasets[0].data, data);
                },
              },
            },
          ],
        },
        plugins: {
          streaming: {
            // per-chart option
            frameRate: 60, // chart is drawn 30 times every second
          },
        },
      },
    });
  },
  props: { chartData: Array },
};
</script>

<style scoped>
.chart-container {
  height: 50vh;
}
</style>
