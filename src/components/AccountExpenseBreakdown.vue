<template>
  <v-card :loading="loading" outlined>
    <v-toolbar flat extended>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>Expenses breakdown</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :to="{ name: 'transaction_categories' }" outlined>
            Manage categories
          </v-btn>
        </v-col>
      </v-row>

      <template v-slot:extension>
        <v-container>
          <v-row align="baseline">
            <v-col cols="auto">
              <v-select
                :items="years"
                :value="year"
                @change="$emit('yearSelection', $event)"
                label="Year"
              />
            </v-col>
            <v-col cols="auto">
              <v-select
                :items="months"
                :value="month"
                @change="$emit('monthSelection', $event)"
                label="Month"
              />
            </v-col>
          </v-row>
        </v-container>
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
export default {
  name: "AccountExpenseBreakdown",
  components: {},
  props: {
    month: Number,
    year: Number,
  },
  data() {
    return {
      months: Array.from(Array(12).keys()).map((m) => m + 1),
      years: Array.from(Array(20).keys()).map(
        (y) => new Date().getFullYear() + 10 - y
      ),

      loading: false,
      transactions: [],
      expense_categories: [],
    }
  },
  watch: {
    account() {
      this.get_transactions()
    },
  },
  mounted() {
    this.get_transaction_categories()
  },
  methods: {
    get_transaction_categories() {
      this.loading = true
      const url = `/transactions/categories`
      this.axios
        .get(url)
        .then(({ data }) => {
          this.expense_categories = data
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
    generate_graph_data() {
      const max_categories = 8
      return (
        this.categorized_expenses
          .reduce((acc, expense) => {
            const entry = acc.find((entry) => entry.label === expense.category)
            const amount = Math.abs(expense.amount)

            // if label not found, create it
            if (!entry) acc.push({ label: expense.category, amount })
            else entry.amount += amount

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
  computed: {
    account() {
      return this.$route.params.account
    },
    dark() {
      return this.$vuetify.theme.dark
    },
    series() {
      return this.generate_graph_data().map((x) => x.amount)
    },
    options() {
      return {
        chart: {
          id: "transactions",
          type: "donut",
        },
        theme: {
          mode: this.dark ? "dark" : "light",
        },
        colors,
        labels: this.generate_graph_data().map(
          (x) => `${x.label}: ${new Intl.NumberFormat().format(x.amount)}`
        ),
      }
    },
    start_date() {
      return new Date(`${this.year}/${this.month}/01`)
    },
    end_date() {
      const end_year = this.month < 12 ? this.year : this.year + 1
      const end_month = this.month < 12 ? this.month + 1 : 1
      return new Date(`${end_year}/${end_month}/01`)
    },
    filtered_transactions() {
      if (!this.start_date) return this.transactions

      let end_date
      if (this.end_date) end_date = new Date(this.end_date)
      else end_date = new Date()

      const start_date = new Date(this.start_date)

      return this.transactions.filter((transaction) => {
        const transaction_time = new Date(transaction.date)

        return end_date > transaction_time && transaction_time > start_date
      })
    },
    expenses() {
      return this.filtered_transactions.filter((transaction) => {
        return transaction.amount < 0
      })
    },
    non_business_expenses() {
      return this.filtered_transactions.filter((transaction) => {
        return transaction.amount < 0 && !transaction.business_expense
      })
    },
    categorized_expenses() {
      // Add a category to every expense
      return this.non_business_expenses.map((expense) => {
        // Find the correct category from the available categories
        const category = expense.category
          ? expense.category
          : this.expense_categories.find((category) =>
              category.keywords.find((keyword) =>
                expense.description.includes(keyword)
              )
            )

        return {
          ...expense,
          category: category ? category.label : expense.description,
        }
      })
    },
  },
}
</script>
