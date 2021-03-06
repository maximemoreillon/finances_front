<template>
  <div class="">

    <h1>{{account || "Transactions"}}</h1>
    <p class="toolbar">
      <label for="">From</label>
      <input
        type="date"
        v-model="start_date"
        @change="populate_graph()">

      <label for="">To</label>
      <input
        type="date"
        v-model="end_date"
        @change="populate_graph()">

      <span class="spacer"/>

      <router-link
        class="button"
        :to="{ name: 'transaction_categories'}">
        Manage expense categories
      </router-link>
    </p>

    <div
      v-if="!loading"
      class="chart_wrapper">
      <apexchart
        ref="chart"
        width="100%"
        height="100%"
        :options="options"
        :series="series" />
    </div>



    <div v-if="!loading">

      <table v-if="!loading && transactions.length > 0">
        <th>Date</th>
        <th class="description_column_header">Description</th>
        <th></th>
        <th>Amount</th>

        <tr
        v-for="(transaction, index) in filtered_transactions"
        v-bind:key="index"
        v-on:click="$router.push({ name: 'transaction', params: { transaction_id: transaction._id } })">
          <td>{{format_date(transaction.date)}}</td>
          <td>{{transaction.description}}</td>
          <td v-if="transaction.business_expense">💼</td>
          <td v-else></td>
          <td class="amount_cell">{{transaction.amount}}</td>
        </tr>
      </table>
    </div>

    <Loader v-if="loading"/>

  </div>
</template>

<script>
// @ is an alias to /src
import Loader from '@/components/Loader.vue'
//import account_config from '@/accounts_config.js'

export default {
  name: 'Transactions',
  components: {
    Loader
  },
  data(){
    return {

      selection: 'all',
      start_date: null,
      end_date: null,

      transactions: [],
      loading: false,

      expense_categories: [],

      options: {
        chart: {
          type: 'donut'
        },
        labels: [],
        colors: [
          '#c00000', '#aaaaaa', '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000',
          '#aaaaaa', '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000', '#aaaaaa',
          '#bf6d6d', '#444444', '#9e3434', '#dddddd','#c00000', '#aaaaaa', '#bf6d6d',
          '#444444', '#9e3434', '#dddddd'],
      },

      series: [],


    }
  },
  watch: {
    account () {
      this.get_transactions()
    }
  },
  mounted(){
    //this.get_transactions(this.$route.query.account)
    this.get_transaction_categories()

  },
  methods: {
    get_transaction_categories(){
      this.loading = true
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories`)
      .then( response => {
        this.expense_categories = response.data
        this.get_transactions()
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.error(error)
        alert('Error')
      })

    },
    get_transactions(){
      this.loading = true

      // TODO: update to REST API
      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/transactions`

      this.axios.get(url)
      .then( response => {
        this.transactions = []

        response.data.forEach((transaction) => {
          this.transactions.push(transaction)
        })

        this.populate_graph()

      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        else console.error(error)
      })
      .finally(() => { this.loading = false})
    },
    populate_graph(){
      const out = this.categorized_expenses
      this.series = out.map(x => x.amount)
      this.options.labels = out.map(x => x.label)
    },

    format_date(date){
      const options = {year: '2-digit', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleString('ja-JP', options)
    },

  },
  computed: {
    account(){
      return this.$route.params.account
    },
    filtered_transactions(){
      if(!this.start_date) return this.transactions

      const end_date = this.end_date || new Date()
      const filter_time = new Date(this.start_date)

      return this.transactions.filter(transaction => {
        const transaction_time = new Date(transaction.date)


        return end_date > transaction_time && transaction_time > filter_time
      })
    },
    expenses(){
      return this.filtered_transactions.filter(transaction => {
        return transaction.amount < 0
      })
    },
    non_business_expenses(){
      return this.filtered_transactions.filter(transaction => {
        return transaction.amount < 0 && !transaction.business_expense
      })
    },
    categorized_expenses(){

      const max_categories = 5

      // Looks quite inefficient
      return this.non_business_expenses
      .reduce(( acc, expense) => {

        // Find the correct category from the available categories
        const category = this.expense_categories.find(category => {
          return category.keywords.find(keyword => {
            return expense.description.includes(keyword)
          })
        })

        // If the expense does not fit in any category, then use description as label
        const label = category ? category.label : expense.description

        const entry = acc.find(entry => {
          return entry.label === label
        })

        const amount = Math.abs(expense.amount)

        // if label not found, create it
        if(!entry) acc.push({ label, amount })
        else entry.amount += amount


        return acc


      }, [])
      // Further reduce to remove categories that are too small
      .sort((a, b) => {
        return b.amount - a.amount
      })
      .reduce((acc, item, index) => {
        if(index < max_categories) {
          acc.push(item)
          return acc
        }
        else {
          if(!acc[max_categories]) {
            acc.push({label: 'Other', amount: item.amount})
          }
          else {
            acc[max_categories].amount += item.amount
          }
          return acc
        }
      }, [])



    }
  }

}
</script>

<style scoped>

.chart_wrapper {
  height: 30vh;
}


table {
  width: 100%;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
  table-layout: fixed;
}

td:first-child {
  width: 20%;
}

.description_column_header{
  width: 65%;
}

td:last-child {
  width: 15%;
  text-align: right;
}

td, th {
  padding: 2px;

  white-space: nowrap;

}

td:not(.amount_cell){
  overflow: hidden;
  text-overflow: ellipsis;
}

tr:not(:first-child){
  border-top: 1px solid #dddddd;
  transition: background-color 0.25s;
  cursor: pointer;
}

tr:not(:first-child):hover{
  background-color: #eeeeee;
}

.toolbar {
  display: flex;
  align-items: center;
}

.toolbar > *:not(:last-child) {
  margin-right: 0.5em;
}

.spacer {
  flex-grow: 1;
}

</style>
