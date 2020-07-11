<script>
// @ is an alias to /src
import { Line } from 'vue-chartjs'

export default {
  name: 'LineChart',
  props: ['data', 'currency'],
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
            callback: value => {
              if(this.currency === 'JPY') {
                return `${(value/10000)}万`
              }
              else {
                return `${(value/1000)}k`
              }



            }
          }

        }]
      }
    });
  }
}
</script>
