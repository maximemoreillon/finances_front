<template>
  <v-card
    :loading="loading"
    outlined>

    <v-card-title>Balance</v-card-title>

    <template v-if="!loading && series.length">


      <v-toolbar flat>

        <v-row align="baseline" dense>
          <v-col cols="6">
            <v-card-title class="">
              {{currency}} {{parseFloat(current_balance).toLocaleString()}}
            </v-card-title>
            <v-card-subtitle class="">
              As of {{last_retrieved_formatted}}
            </v-card-subtitle>
          </v-col>
          <v-spacer/>
          <v-col
            cols="auto"
            v-for="button in chartControlButtons"
            :key="button.value">
            <v-btn
              x-small
              :dark="selection===button.value"
              @click="updateData(button.value)">
              {{button.text}}
            </v-btn>
          </v-col>

        </v-row>
      </v-toolbar>

      <v-card-text>
        <apexchart
          ref="chart"
          width="100%"
          height="300px"
          :options="options"
          :series="series" />
      </v-card-text>

    </template>

    <v-card-text v-if="!loading && !series.length">
      Account {{account}} does not have a balance history
    </v-card-text>

  </v-card>
</template>

<script>

export default {
  name: 'AccountBalanceHistory',
  components: {

  },
  data(){
    return {
      loading: false,
      current_balance: "loading",
      currency: null,
      last_retrieved: null,
      selection: 'all',

      chartControlButtons: [
        {text: '1M', value: 'one_month'},
        {text: '6M', value: 'six_months'},
        {text: '1Y', value: 'one_year'},
        {text: 'ALL', value: 'all'},
      ],

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
      series: [],
    }
  },
  watch: {
    account(){
      this.get_balance_history()
    }
  },
  mounted(){
    this.get_balance_history()
  },
  methods: {
    get_balance_history(){
      // Loading history
      this.loading = true

      this.series = []

      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/balance/history`

      this.axios.get(url)
      .then( ({data}) => {

        if(!data.length) return

        const data_length = data.length
        const last_item = data[data_length-1]

        this.current_balance = last_item.balance
        this.currency = last_item.currency
        this.last_retrieved = last_item.time

        const chart_data = data.map(({balance, time}) => [ new Date(time).getTime(), Math.round(balance)] )

        this.series = [ { name: 'balance', data: chart_data } ]

      })
      .catch( error => {
        console.error(error)
        alert(`Failed to load data`)
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
    },
    account(){
      return this.$route.params.account
    }
  }
}
</script>
