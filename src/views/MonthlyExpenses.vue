<template>
  <v-card
    :loading="loading">

    <v-card-title>
        MonthlyExpenses
    </v-card-title>
    <v-card-subtitle>
        Account: {{account}}
    </v-card-subtitle>

    <v-card-text>
        <v-select
            :items="years"
            v-model="year"
            label="Year"
        ></v-select>
    </v-card-text>

    <v-card-text>
        <apexchart
        ref="chart"
        width="100%"
        height="200"
        :options="options"
        :series="series" />
    </v-card-text>

  </v-card>
</template>

<script>


export default {
  name: 'MonthlyExpenses',

  data(){
    return {

      start_date: null,
      end_date: null,

      transactions: [],
      loading: false,

      years: Array.from(Array(10).keys()).map(y => 2022-y),
      year: new Date().getYear() + 1900,

      options: {
        chart: {
          id: 'area-datetime',
          type: 'bar',
        },
        colors: ['#c00000'],
        dataLabels: {
          enabled: false
        },
      },




    }
  },
  watch: {
    account () {
      this.get_transactions()
    }
  },
  mounted(){
    this.get_transactions()

  },
  methods: {

    get_transactions(){
      this.loading = true

      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/transactions`

      this.axios.get(url)
        .then( ({data}) => { this.transactions = data })
        .catch(error => {
            if(error.response) console.log(error.response.data)
            else console.error(error)
        })
        .finally(() => { this.loading = false})
    },

    transactions_of_month(year, month){

        const start_date = new Date(`${year}/${month}/01`)
        const end_year = month < 12 ? year : year + 1;
        const end_month = month < 12 ? month + 1 : 1;

        const end_date = new Date(`${end_year}/${end_month}/01`)

        return this.transactions.filter(t => (start_date < new Date(t.date)) && (new Date(t.date) < end_date))
    },

    sum_for_month(year, month) {
        return this.transactions_of_month(year,month)
            .reduce( (acc, {amount}) => {
                // Only expenses
                if(amount < 0) acc += -amount
                return acc
            }, 0)
    }


  },
  computed: {
    account(){
      return this.$route.params.account
    },
    formatted_transactions(){
        return Array.from(Array(12).keys())
            .map(m => m + 1)
            .map(month => this.sum_for_month(this.year, month) )
    },
    series(){
        return [{ data: this.formatted_transactions }]
    }




  }


}
</script>

<style scoped>


</style>
