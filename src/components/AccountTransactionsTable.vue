<template>
  <v-card
    :loading="loading"
    outlined>

    <v-card-title>Transactions</v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="transactions"
        :loading="loading">

        <template v-slot:item.date="{ item: {date} }">
          {{new Date(date).toLocaleString('ja-JP', toLocaleStringOptions)}}
        </template>

        <template v-slot:item.amount="{ item: {amount} }">
          <span class="red--text" v-if="amount < 0">{{amount}}</span>
          <span class="green--text" v-else>{{amount}}</span>
        </template>

      </v-data-table>



    </v-card-text>

  </v-card>
</template>

<script>

export default {
  name: 'AccountTransactionsTable',
  components: {

  },
  data(){
    return {
      loading: false,
      transactions: [],
      headers: [
        {text: 'Date', value: 'date'},
        {text: 'Description', value: 'description'},
        {text: 'Amount', value: 'amount'},
      ],
      toLocaleStringOptions: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    }
  },
  watch: {
    account(){
      this.get_transactions()
    }
  },
  mounted(){
    this.get_transaction_categories()
    this.get_transactions()
  },
  methods: {
    get_transaction_categories(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories`)
      .then( ({data}) => { this.expense_categories = data })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.error(error)
        alert('Error')
      })

    },
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
  },
  computed: {
    account(){
      return this.$route.params.account
    }
  }
}
</script>
