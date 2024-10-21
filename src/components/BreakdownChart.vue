<template>
  <apexchart height="300" :options="options" :series="series" />
</template>

<script>
import { colors } from "@/constants"

import queryParamsUtils from "@/mixins/queryParamsUtils"
import dateUtils from "@/mixins/dateUtils"

export default {
  name: "BreakdownChart",
  components: {},
  mixins: [queryParamsUtils, dateUtils],

  props: {
    transactions: Array,
  },
  data() {
    return {
      // transactions: [],
    }
  },
  watch: {},
  mounted() {},
  methods: {},
  computed: {
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

    explicitlyCategorizedExpenses() {
      return this.transactions.map((expense) => {
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
