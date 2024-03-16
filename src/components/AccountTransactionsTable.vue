<template>
  <v-card :loading="loading" outlined>
    <v-card-title>Transactions</v-card-title>

    <v-card-text>
      <v-data-table :headers="headers" :items="transactions" :loading="loading">
        <template v-slot:item.description="{ item }">
          <router-link
            :to="{ name: 'transaction', params: { transaction_id: item._id } }"
          >
            {{ item.description }}
          </router-link>
        </template>

        <template v-slot:item.date="{ item: { date } }">
          {{ new Date(date).toLocaleString("ja-JP", toLocaleStringOptions) }}
        </template>

        <template v-slot:item.amount="{ item: { amount } }">
          <span :class="amount < 0 ? 'red--text' : 'green-text'">
            {{ new Intl.NumberFormat().format(amount) }}
          </span>
        </template>

        <template v-slot:item.business_expense="{ item: { business_expense } }">
          <v-icon v-if="business_expense">mdi-check</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AccountTransactionsTable",
  components: {},
  data() {
    return {
      loading: false,
      transactions: [],
      headers: [
        { text: "Date", value: "date" },
        { text: "Description", value: "description" },
        { text: "Amount", value: "amount" },
        { text: "Category", value: "category.label" },
        { text: "Business", value: "business_expense" },
      ],
      toLocaleStringOptions: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    }
  },
  watch: {
    account() {
      this.get_transactions()
    },
  },
  mounted() {
    this.get_transaction_categories()
    this.get_transactions()
  },
  methods: {
    get_transaction_categories() {
      this.axios
        .get(`/transactions/categories`)
        .then(({ data }) => {
          this.expense_categories = data
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          else console.error(error)
          alert("Error")
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
  },
  computed: {
    account() {
      return this.$route.params.account
    },
  },
}
</script>
