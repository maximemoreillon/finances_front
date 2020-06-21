<template>
  <div class="balance_history">

    <div v-if="dataCollection.loaded">

      <div class="current_balance_container">
        Current balance: JPY {{current_balance.toLocaleString()}}
      </div>

      <LineChart
        class="chart"
        v-if="dataCollection.loaded"
        v-bind:data="dataCollection"/>

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
  mounted(){
    this.get_balance_history(this.$route.query.account)


  },
  methods: {
    get_balance_history(account){
      // Loading history
      this.dataCollection.loaded = false;
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/balance_history`, {
        params: {account: account}
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

        this.dataCollection.loaded = true;
      })
      .catch( error => console.log(error))
    }
  }
}
</script>

<style scoped>

.current_balance_container{
  text-align: center;
  font-size: 120%;
  margin-bottom: 25px;
}

</style>
