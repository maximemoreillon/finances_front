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


    <div v-if="dataCollection.loaded">

        <div class="current_balance_container">
          Current balance: {{currency}} {{parseFloat(current_balance).toLocaleString()}}
        </div>
        <div class="last_retrieved">
          (Last retrieved {{last_retrieved_formatted}})
        </div>







      <LineChart
        class="chart"
        v-if="dataCollection.loaded"
        v-bind:data="dataCollection"
        v-bind:currency="currency"/>

    </div>

    <Loader v-else/>

  </div>
</template>

<script>
// @ is an alias to /src
import LineChart from '@/components/charts/LineChart.vue'
import Loader from '@/components//Loader.vue'

export default {
  name: 'BalanceHistory',
  components: {
    LineChart,
    Loader
  },
  data(){
    return {
      current_balance: "loading",
      currency: null,
      last_retrieved: null,

      dataCollection: {
        loaded: false,
        labels: [], // filled by API call
        datasets: [
          {
            label: 'Balance',
            data: [], // filled by API call
            borderColor: '#c00000',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 3,
            pointHoverRadius: 3,
            borderWidth: 2,
          }
        ],
      }
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
      this.dataCollection.loaded = false;

      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/balance_history`, {
        params: {account: this.$route.query.account}
      })
      .then(response => {

        // Empty array
        this.dataCollection.labels.splice(0,this.dataCollection.labels.length)
        this.dataCollection.datasets[0].data.splice(0,this.dataCollection.datasets[0].data.length)
        // repopulate
        response.data.forEach(entry => {
          this.dataCollection.datasets[0].data.push(Number(entry.balance))
          this.dataCollection.labels.push(new Date(entry.time))
        })

        this.current_balance = response.data[response.data.length-1].balance
        this.currency = response.data[response.data.length-1].currency
        this.last_retrieved = response.data[response.data.length-1].time

        this.dataCollection.loaded = true;
      })
      .catch( error => console.log(error))
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

.chart {
  margin-top: 1em;
}

</style>
