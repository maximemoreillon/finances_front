<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Transactions </v-toolbar-title>
      <v-spacer />
      <TransactionRegisterDialog
        :accountId="String(accountId)"
        @transactionRegistered="get_transactions()"
      />
    </v-toolbar>

    <v-card-text>
      <v-row dense align="center">
        <v-col cols="auto">
          <YearSelect
            :year="year"
            @yearSelection="$emit('yearSelection', $event)"
          />
        </v-col>
        <v-col cols="auto">
          <MonthSelect
            :month="month"
            @monthSelection="$emit('monthSelection', $event)"
          />
        </v-col>
        <!-- </v-row>
      <v-row> -->
        <v-col cols="auto">
          <v-text-field
            label="Search"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-chip
            close
            v-if="category"
            @click:close="setQueryParam('category', null)"
          >
            {{ categories.find((c) => c.id.toString() === category)?.name }}
          </v-chip>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="transactions"
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
            :to="{
              name: 'transaction_category',
              params: { categoryId: category.id },
            }"
          >
            {{ category.name }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import MonthSelect from "./MonthSelect.vue"
import YearSelect from "./YearSelect.vue"
import TransactionRegisterDialog from "./TransactionRegisterDialog.vue"
import queryParamsUtils from "../mixins/queryParamsUtils"
export default {
  name: "AccountTransactionsTable",
  components: {
    TransactionRegisterDialog,
    YearSelect,
    MonthSelect,
  },
  mixins: [queryParamsUtils],
  props: {
    // Those could be query params?
    // year: Number,
    // month: Number,
    // category: Number,
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
    // year() {
    //   this.get_transactions()
    // },
    month() {
      this.get_transactions()
    },
    category() {
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
        from: this.start_date,
        to: this.end_date,
        category: this.category,
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

    start_date() {
      if (this.month === -1) return new Date(`${this.year}/01/01`)
      return new Date(`${this.year}/${this.month}/01`)
    },
    end_date() {
      if (this.month === -1) return new Date(`${this.year}/12/31`)

      const end_year = this.month < 12 ? this.year : this.year + 1
      const end_month = this.month < 12 ? this.month + 1 : 1
      return new Date(`${end_year}/${end_month}/01`)
    },
  },
}
</script>
