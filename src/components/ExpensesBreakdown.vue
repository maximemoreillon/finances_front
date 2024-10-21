<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Transactions breakdown </v-toolbar-title>
      <v-spacer />
      <v-btn :to="{ name: 'transaction_categories' }" outlined>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-row align="baseline">
        <v-col cols="auto">
          <YearSelect />
        </v-col>
        <v-col cols="auto">
          <MonthSelect />
        </v-col>
        <v-spacer />
        <v-col cols="auto"> {{ transactions.length }} transactions </v-col>
      </v-row>
      <v-row v-if="transactions.length">
        <v-col cols="12" md="6">
          <h3>Income</h3>
          <BreakdownChart :transactions="income" />
        </v-col>
        <v-col cols="12" md="6">
          <h3>Expenses</h3>
          <BreakdownChart :transactions="expenses" />
        </v-col>
      </v-row>

      <div v-else-if="!loading" class="text-center">No Data available</div>
    </v-card-text>
  </v-card>
</template>

<script>
import YearSelect from "@/components/YearSelect.vue"
import MonthSelect from "@/components/MonthSelect.vue"
import queryParamsUtils from "@/mixins/queryParamsUtils"
import dateUtils from "@/mixins/dateUtils"
import BreakdownChart from "./BreakdownChart.vue"
export default {
  name: "AccountExpenseBreakdown",
  components: { YearSelect, MonthSelect, BreakdownChart },
  mixins: [queryParamsUtils, dateUtils],

  props: {},
  data() {
    return {
      loading: false,
      transactions: [],
      expense_categories: [],
    }
  },
  watch: {
    accountId() {
      this.get_transactions()
    },
    year() {
      this.get_transactions()
    },
    month() {
      this.get_transactions()
    },
  },
  mounted() {
    this.get_transaction_categories()
  },
  methods: {
    get_transaction_categories() {
      this.loading = true
      const url = `/categories`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.expense_categories = data.categories
          this.get_transactions()
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          else console.error(error)
          alert("Error")
        })
        .finally(() => {
          this.loading = false
        })
    },
    get_transactions() {
      this.loading = true

      let url
      if (this.accountId) url = `/accounts/${this.accountId}/transactions`
      else url = `/transactions`
      const params = { from: this.start_date, to: this.end_date }

      this.axios
        .get(url, { params })
        .then(({ data }) => {
          this.transactions = data.records
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          else console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {
    accountId() {
      return this.$route.params.accountId
    },
    dark() {
      return this.$vuetify.theme.dark
    },

    expenses() {
      return this.transactions.filter((transaction) => transaction.amount < 0)
    },

    income() {
      return this.transactions.filter((transaction) => transaction.amount > 0)
    },
  },
}
</script>
