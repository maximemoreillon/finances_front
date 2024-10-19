<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Expenses breakdown </v-toolbar-title>
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
      <apexchart
        v-if="transactions.length"
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
import YearSelect from "@/components/YearSelect.vue"
import MonthSelect from "@/components/MonthSelect.vue"
import queryParamsUtils from "@/mixins/queryParamsUtils"
import dateUtils from "@/mixins/dateUtils"

export default {
  name: "AccountExpenseBreakdown",
  components: { YearSelect, MonthSelect },
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
    series() {
      return this.generatedGraphData.map((x) => x.amount)
    },
    options() {
      return {
        chart: {
          type: "donut",
          events: {
            dataPointSelection: (_, __, config) => {
              const categoryId =
                this.generatedGraphData[config.dataPointIndex].id

              if (categoryId === undefined) return
              if (categoryId === this.category)
                this.setQueryParam("category", null)
              else this.setQueryParam("category", categoryId)
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
