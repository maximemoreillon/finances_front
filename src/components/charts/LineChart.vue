<script>
// @ is an alias to /src
import { Line } from 'vue-chartjs'

export default {
  name: 'LineChart',
  props: ['data'],
  mixins: [Line],
  mounted(){
    this.renderChart(this.data, {

      // Options come here
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: { quarter: 'MMM YYYY'}
          }
        }],
        yAxes: [{
          ticks: {
            // Include a dollar sign in the ticks
            callback: value => {
              return value/10000 + "万円";
            }
          }
        }]
      }
    });
  }
}
</script>
