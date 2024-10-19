<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Monthly transactions</v-toolbar-title>
      <v-spacer />
    </v-toolbar>

    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <YearSelect
            :year="year"
            @yearSelection="$emit('yearSelection', $event)"
          />
        </v-col>
      </v-row>
      <apexchart
        v-if="transactions.length"
        ref="chart"
        width="100%"
        height="300"
        :options="options"
        :series="series"
      />
      <div v-else-if="!loading" class="text-center">No Data available</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { colors } from "@/constants"
import YearSelect from "./YearSelect.vue"
import queryParamsUtils from "../mixins/queryParamsUtils"

export default {
  name: "TransactionsBarChart",
  components: { YearSelect },
  mixins: [queryParamsUtils],

  data() {
    return {
      loading: false,
      transactions: [],
    }
  },
  watch: {
    accountId() {
      this.get_transactions()
    },
    year() {
      this.get_transactions()
    },
  },
  mounted() {
    this.get_transactions()
  },
  methods: {
    async get_transactions() {
      this.loading = true
      try {
        let url
        if (this.categoryId) url = `/categories/${this.categoryId}/transactions`
        else if (this.accountId)
          url = `/accounts/${this.accountId}/transactions`
        else url = `/transactions`

        const params = {
          from: new Date(`${this.year}/1/1`),
          to: new Date(`${this.year}/12/1`),
        }

        const { data } = await this.axios.get(url, { params })
        this.transactions = data.records
      } catch (error) {
        if (error.response) console.log(error.response.data)
        else console.error(error)
      } finally {
        this.loading = false
      }
    },

    transactions_of_month(year, month) {
      const start_date = new Date(`${year}/${month}/01`)
      const end_year = month < 12 ? year : year + 1
      const end_month = month < 12 ? month + 1 : 1

      const end_date = new Date(`${end_year}/${end_month}/01`)

      return this.transactions.filter(
        (t) => start_date <= new Date(t.time) && new Date(t.time) < end_date
      )
    },
    incomeTotalForMonth(year, month) {
      return this.transactions_of_month(year, month).reduce(
        (acc, { amount }) => {
          if (amount > 0) acc += amount
          return acc
        },
        0
      )
    },
    expensesTotalForMonth(year, month) {
      return this.transactions_of_month(year, month).reduce(
        (acc, { amount }) => {
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
              this.setQueryParam("month", clicked_month)
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

        colors,
        dataLabels: {
          enabled: false,
        },
      }
    },
    accountId() {
      return this.$route.params.accountId
    },
    categoryId() {
      return this.$route.params.categoryId
    },

    formatted_income() {
      return Array.from(Array(12).keys())
        .map((m) => m + 1)
        .map((month) => this.incomeTotalForMonth(this.year, month))
    },
    formatted_expenses() {
      return Array.from(Array(12).keys())
        .map((m) => m + 1)
        .map((month) => this.expensesTotalForMonth(this.year, month))
    },
    series() {
      return [
        { name: "Expenses", data: this.formatted_expenses },
        { name: "Income", data: this.formatted_income },
      ]
    },
  },
}
</script>
