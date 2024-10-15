<template>
  <v-card outlined>
    <v-card-title>Transactions</v-card-title>

    <v-card-text>
      <v-data-table :headers="headers" :items="transactions" :loading="loading">
        <template v-slot:item.description="{ item }">
          <router-link
            :to="{
              name: 'transaction',
              params: { accountId: accountId, transactionId: item.id },
            }"
          >
            {{ item.description }}
          </router-link>
        </template>

        <template v-slot:item.time="{ item: { time } }">
          {{ new Date(time).toLocaleString("ja-JP", toLocaleStringOptions) }}
        </template>

        <template v-slot:item.amount="{ item: { amount } }">
          <span :class="amount < 0 ? 'red--text' : 'green-text'">
            {{ new Intl.NumberFormat().format(amount) }}
          </span>
        </template>

        <template v-slot:item.category="{ item }">
          <span v-if="categories.length">
            {{
              item.categories?.map((c) => c.name).join(", ") ||
              categories
                .filter(({ keywords }) =>
                  keywords.find((k) => item.description.includes(k))
                )
                .map((c) => c.name)
                .join(", ")
            }}
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
        { text: "Date", value: "time" },
        { text: "Description", value: "description" },
        { text: "Amount", value: "amount" },
        { text: "Category", value: "category" },
        // { text: "Business", value: "business_expense" },
      ],
      toLocaleStringOptions: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      categories: [],
    }
  },
  watch: {
    account() {
      this.get_transactions()
    },
  },
  async mounted() {
    await this.get_transaction_categories()
    this.get_transactions()
  },
  methods: {
    async get_transaction_categories() {
      const { data } = await this.axios.get(`/categories`)
      this.categories = data.categories
    },
    get_transactions() {
      this.loading = true

      const url = `/accounts/${this.accountId}/transactions`

      this.axios
        .get(url)
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
  },
}
</script>
