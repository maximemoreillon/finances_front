<template>
  <v-card :loading="loading" outlined>
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>Monthly expenses</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-select
            :items="years"
            :value="year"
            @change="$emit('yearSelection', $event)"
            label="Year"
          />
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <apexchart
        ref="chart"
        width="100%"
        height="300"
        :options="options"
        :series="series"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AccountMonthlyExpensesTotal",
  components: {},
  props: {
    year: Number,
  },
  data() {
    return {
      loading: false,
      transactions: [],
      years: Array.from(Array(20).keys()).map(
        (y) => new Date().getFullYear() + 10 - y
      ),
    }
  },
  watch: {
    account() {
      this.get_transactions()
    },
  },
  mounted() {
    this.get_transactions()
  },
  methods: {
    get_transactions() {
      this.loading = true

      const url = `/accounts/${this.account}/transactions`

      this.axios
        .get(url)
        .then(({ data }) => {
          this.transactions = data
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          else console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    transactions_of_month(year, month) {
      const start_date = new Date(`${year}/${month}/01`)
      const end_year = month < 12 ? year : year + 1
      const end_month = month < 12 ? month + 1 : 1

      const end_date = new Date(`${end_year}/${end_month}/01`)

      return this.transactions.filter(
        (t) => start_date < new Date(t.date) && new Date(t.date) < end_date
      )
    },
    income_sum_for_month(year, month) {
      return this.transactions_of_month(year, month).reduce(
        (acc, { amount }) => {
          // Only expenses
          if (amount > 0) acc += amount
          return acc
        },
        0
      )
    },
    expenses_sum_for_month(year, month) {
      return this.transactions_of_month(year, month).reduce(
        (acc, { amount }) => {
          // Only expenses
          if (amount < 0) acc += -amount
          return acc
        },
        0
      )
    },
  },
  computed: {
    dark() {
      return this.$vuetify.theme.dark
    },
    options() {
      return {
        chart: {
          id: "area-datetime",
          type: "bar",
          events: {
            dataPointSelection: (_, __, config) => {
              const clicked_month = config.dataPointIndex + 1
              this.$emit("monthSelection", clicked_month)
            },
          },
        },
        theme: {
          mode: this.dark ? "dark" : "light",
        },
        background: "#c00",

        xaxis: {
          categories: Array.from(Array(12).keys()).map((m) => m + 1),
        },

        colors: ["#00c000", "#c00000"],
        dataLabels: {
          enabled: false,
        },
      }
    },
    account() {
      return this.$route.params.account
    },
    formatted_income() {
      return Array.from(Array(12).keys())
        .map((m) => m + 1)
        .map((month) => this.income_sum_for_month(this.year, month))
    },
    formatted_expenses() {
      return Array.from(Array(12).keys())
        .map((m) => m + 1)
        .map((month) => this.expenses_sum_for_month(this.year, month))
    },
    series() {
      return [
        { name: "Income", data: this.formatted_income },
        { name: "Expenses", data: this.formatted_expenses },
      ]
    },
  },
}
</script>
