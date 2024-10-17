<template>
  <v-card :loading="loading" flat>
    <v-toolbar flat extended>
      <v-toolbar-title>Expenses breakdown</v-toolbar-title>
      <v-spacer />
      <v-btn :to="{ name: 'transaction_categories' }" outlined>
        Manage categories
      </v-btn>

      <template v-slot:extension>
        <v-row align="baseline">
          <v-col cols="1">
            <YearSelect
              @yearSelection="$emit('yearSelection', $event)"
              :year="year"
            />
          </v-col>
          <v-col cols="1">
            <MonthSelect
              :month="month"
              @monthSelection="$emit('monthSelection', $event)"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto"> {{ transactions.length }} transactions </v-col>
        </v-row>
      </template>
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
import { colors } from "@/constants"
import YearSelect from "./YearSelect.vue"
import MonthSelect from "./MonthSelect.vue"

export default {
  name: "AccountExpenseBreakdown",
  components: { YearSelect, MonthSelect },
  props: {
    month: Number,
    year: Number,
    category: Number,
  },
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

      // TODO: query parameters for querying only selected time period

      const url = `/accounts/${this.accountId}/transactions`
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
    series() {
      return this.generatedGraphData.map((x) => x.amount)
    },
    options() {
      return {
        chart: {
          id: "transactions",
          type: "donut",
          events: {
            dataPointSelection: (_, __, config) => {
              // TODO: consider name instead, for display purposes
              const categoryId =
                this.generatedGraphData[config.dataPointIndex].id

              if (categoryId === null) return
              if (categoryId === this.category)
                this.$emit("categorySelected", null)
              else this.$emit("categorySelected", categoryId)
            },
          },
        },
        theme: {
          mode: this.dark ? "dark" : "light",
        },
        colors,
        labels: this.generatedGraphData.map(
          (x) => `${x.label}: ${new Intl.NumberFormat().format(x.amount)}`
        ),
      }
    },
    start_date() {
      if (this.month === 0) return new Date(`${this.year}/01/01`)
      return new Date(`${this.year}/${this.month}/01`)
    },
    end_date() {
      if (this.month === 0) return new Date(`${this.year}/12/31`)

      const end_year = this.month < 12 ? this.year : this.year + 1
      const end_month = this.month < 12 ? this.month + 1 : 1
      return new Date(`${end_year}/${end_month}/01`)
    },

    expenses() {
      return this.transactions.filter((transaction) => {
        return transaction.amount < 0
      })
    },

    implicitylyCategorizedExpenses() {
      // UNUSED FOR THE TIME BEING
      // WARNING: transactions can now have multiple categories
      // WARNING: This needs refactoring
      return this.expenses.map((expense) => {
        let category = expense.description

        const foundCategory = this.expense_categories.find((category) =>
          category.keywords.find((keyword) =>
            expense.description.includes(keyword)
          )
        )

        if (foundCategory) category = foundCategory.name

        // TODO: categories plural
        return {
          ...expense,
          category,
        }
      })
    },

    explicitlyCategorizedExpenses() {
      return this.expenses.map((expense) => {
        const categories = expense.categories
          ? expense.categories
          : [{ name: expense.description, id: null }]

        return {
          ...expense,
          categories,
        }
      })
    },

    generatedGraphData() {
      const max_categories = 8
      return (
        this.explicitlyCategorizedExpenses
          .reduce((acc, expense) => {
            for (const expenseCategory of expense.categories) {
              const entry = acc.find(
                (entry) => entry.label === expenseCategory.name
              )
              const amount = Math.abs(expense.amount)

              if (!entry)
                acc.push({
                  label: expenseCategory.name,
                  amount,
                  id: expenseCategory.id,
                })
              else entry.amount += amount
            }

            return acc
          }, [])
          // Further reduce to remove categories that are too small
          .sort((a, b) => b.amount - a.amount)
          // Remove categories that are too small
          .reduce((acc, item, index) => {
            if (index < max_categories) acc.push(item)
            else {
              if (!acc[max_categories])
                acc.push({ label: "Other", amount: item.amount })
              else acc[max_categories].amount += item.amount
            }
            return acc
          }, [])
      )
    },
  },
}
</script>
