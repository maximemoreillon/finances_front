<template>
  <div class="balance_history">

    <h1>{{ $route.query.account  || Balance}}</h1>

    <!-- TODO: Replace by more appripriate div with proper styling -->
    <p>
      <router-link
        class="button"
        :to="{ name: 'register_balance'}">
        Register balance
      </router-link>
    </p>


    <Loader v-if="loading"/>

    <template v-if="!loading">
      <div class="current_balance_container">
        Current balance: {{currency}} {{parseFloat(current_balance).toLocaleString()}}
      </div>
      <div class="last_retrieved">
        (Last retrieved {{last_retrieved_formatted}})
      </div>


      <!-- TODO: Replace by more appripriate div with proper styling -->
      <p class="zoom_buttons_wrapper">
        <button
          id="one_month"
          @click="updateData('one_month')"
          :class="{active: selection==='one_month'}">
          1M
        </button>

          <button
            id="six_months"
            @click="updateData('six_months')"
            :class="{active: selection==='six_months'}">
            6M
          </button>

          <button
            id="one_year"
            @click="updateData('one_year')"
            :class="{active: selection==='one_year'}">
            1Y
          </button>

          <button
            id="all"
            @click="updateData('all')"
            :class="{active: selection==='all'}">
            ALL
          </button>
      </p>


      <div
        v-if="!loading"
        class="chart_wrapper">
        <apexchart
          ref="chart"
          width="100%"
          height="100%"
          v-bind:options="options"
          :series="series" />
      </div>

    </template>







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
      selection: 'one_year',

      options: {
        chart: {
          id: 'area-datetime',
          type: 'area',
          zoom: {
            autoScaleYaxis: true
          },
        },
        stroke: {
          curve: 'straight',
        },

        colors: ['#c00000'],

        xaxis: {
          type: 'datetime'
        },
        dataLabels: {
          enabled: false
        },

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
    },

    updateData(timeline){
      this.selection = timeline

      switch (timeline) {
        case 'one_month':
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 1),
            new Date()
          )
          break
        case 'six_months':
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 6),
            new Date()
          )
          break
        case 'one_year':
          this.$refs.chart.zoomX(
            new Date().setMonth(new Date().getMonth() - 12),
            new Date()
          )
          break
        case 'all':
          this.$refs.chart.zoomX(
            this.series[0].data[0][0],
            new Date(),
          )
          break
        default:
      }
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

.zoom_buttons_wrapper button:not(:last-child) {
  margin-right: 0.5em;
}

.zoom_buttons_wrapper button.active {
  color: white;
  background-color: #c00000;
  border-color: #c00000; 
}

</style>
