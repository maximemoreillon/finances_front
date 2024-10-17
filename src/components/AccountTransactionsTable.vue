<template>
  <v-card flat>
    <v-toolbar flat extended>
      <v-toolbar-title>Transactions ({{ year }})</v-toolbar-title>
      <v-spacer />
      <TransactionRegisterDialog
        :accountId="String(accountId)"
        @transactionRegistered="get_transactions()"
      />
      <template v-slot:extension>
        <v-row>
          <v-col cols="auto">
            <YearSelect
              :year="year"
              @yearSelection="$emit('yearSelection', $event)"
            />
          </v-col>
          <v-col cols="5">
            <v-text-field
              label="Search"
              v-model="search"
              prepend-icon="mdi-magnify"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-chip
              close
              v-if="category"
              @click:close="$emit('categoryChanged', null)"
              >Category: {{ category }}</v-chip
            >
          </v-col>
        </v-row>
      </template>
    </v-toolbar>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredTransactions"
        :loading="loading"
        :search="search"
      >
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

        <template v-slot:item.categories="{ item }">
          <v-chip
            v-for="category of item.categories"
            :key="category.id"
            class="mx-1"
          >
            {{ category.name }}
          </v-chip>
        </template>

        <!-- <template v-slot:item.inferredCategories="{ item }">
          <v-chip
            v-for="category of categories.filter(({ keywords }) =>
              keywords.find((k) => item.description.includes(k))
            )"
            :key="category.id"
            class="mx-1"
          >
            {{ category.name }}
          </v-chip>
        </template> -->
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import TransactionRegisterDialog from "./TransactionRegisterDialog.vue"
import YearSelect from "./YearSelect.vue"
export default {
  name: "AccountTransactionsTable",
  components: {
    TransactionRegisterDialog,
    YearSelect,
  },
  props: {
    // Those could be query params?
    year: Number,
    month: Number,
    category: Number,
  },
  data() {
    return {
      loading: false,
      search: "",
      transactions: [],
      headers: [
        { text: "Date", value: "time" },
        { text: "Description", value: "description" },
        { text: "Amount", value: "amount" },
        { text: "Categories", value: "categories" },
        // { text: "Inferred Categories", value: "inferredCategories" },
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
    accountId() {
      this.get_transactions()
    },
    year() {
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

      const params = {
        to: new Date(`${this.year}-12-31`),
        from: new Date(`${this.year}-01-01`),
      }

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
    // TODO: server-side
    filteredTransactions() {
      if (!this.category) return this.transactions
      return this.transactions.filter((t) =>
        t.categories.some((c) => c.id === this.category)
      )
    },
  },
}
</script>
