<template>
  <div class="balance_history">

    <h1>{{ $route.query.account  || Balance}}</h1>

    <p>
      <router-link
        class="button"
        :to="{ name: 'register_balance'}">
        Register balance
      </router-link>
    </p>

    <template v-if="!loading">
      <div class="current_balance_container">
        Current balance: {{currency}} {{parseFloat(current_balance).toLocaleString()}}
      </div>
      <div class="last_retrieved">
        (Last retrieved {{last_retrieved_formatted}})
      </div>
    </template>


    <Loader v-if="loading"/>

    <div
      v-if="!loading"
      class="chart_wrapper">
      <apexchart

        ref="weight_chart"
        width="100%"
        height="100%"
        type="area"
        v-bind:options="options"
        :series="series" />
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@/components//Loader.vue'

export default {
  name: 'BalanceHistory',
  components: {
    Loader
  },
  data(){
    return {
      loading: false,
      current_balance: "loading",
      currency: null,
      last_retrieved: null,

      options: {
        chart: {
          id: 'balance-chart',
        },
        zoom: {
          autoScaleYaxis: true
        },
        colors: ['#c00000'],
        /*
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        */

        xaxis: {
          type: 'datetime'
        },
        dataLabels: {
          enabled: false
        },
        /*
        yaxis: {
          min: 0,
          max: 100,
        }
        */

      },
      series: [{
        data: []
      }],
    }
  },
  beforeRouteUpdate (_to, _from, next) {
    next()
    this.$nextTick()
      .then(() => {
        this.get_balance_history()
      })
  },
  mounted(){
    this.get_balance_history()
  },
  methods: {
    get_balance_history(){
      // Loading history
      this.loading = true

      const url = `${process.env.VUE_APP_FINANCES_API_URL}/balance_history`
      // TODO: use REST API
      const options = {
        params: {account: this.$route.query.account}
      }

      this.axios.get(url, options)
      .then(response => {

        const data_length = response.data.length
        const last_item = response.data[data_length-1]

        this.current_balance = last_item.balance
        this.currency = last_item.currency
        this.last_retrieved = last_item.time

        const chart_data = response.data.map((entry) => {
          return [
            new Date(entry.time).getTime(),
            entry.balance
          ]
        })

        this.series = [ { name: 'balance', data: chart_data } ]




      })
      .catch( error => {
        console.error(error)
        alert('`Failed to load data`')
      })
      .finally(() => {this.loading = false})
    }
  },
  computed: {
    last_retrieved_formatted(){
      const date =  new Date(this.last_retrieved)
      const year = date.getYear() + 1900
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}/${month}/${day}`
    }
  }
}
</script>

<style scoped>

.current_balance_container{
  text-align: center;
  font-size: 120%;
}

.last_retrieved {
  margin-top: 0.25em;
  font-size: 80%;
  text-align: center;
}

.current_weight_wrapper{
  text-align: center;
  font-size: 150%;
}

.chart_wrapper {
  height: 60vh;
}

</style>
