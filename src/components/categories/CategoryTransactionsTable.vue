<template>
  <v-card>
    <v-card-title> Transactions </v-card-title>

    <v-card-text>
      <v-row dense align="center">
        <v-col cols="auto">
          <YearSelect />
        </v-col>
        <v-col cols="auto">
          <MonthSelect />
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

        <template v-slot:item.account_id="{ item: { account_id } }">
          <router-link
            :to="{ name: 'account', params: { accountId: account_id } }"
          >
            {{ accounts.find((a) => a.id === account_id)?.name }}
          </router-link>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import MonthSelect from "@/components/MonthSelect.vue"
import YearSelect from "@/components/YearSelect.vue"
import queryParamsUtils from "@/mixins/queryParamsUtils"
import dateUtils from "../../mixins/dateUtils"

export default {
  name: "CategoryTransactionsTable",
  components: {
    YearSelect,
    MonthSelect,
  },
  mixins: [queryParamsUtils, dateUtils],
  props: {
    // Those could be query params?
    // category: String,
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
        { text: "Account", value: "account_id" },

        // { text: "Categories", value: "categories" },
        // { text: "Inferred Categories", value: "inferredCategories" },
      ],
      toLocaleStringOptions: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      accounts: [],
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
  async mounted() {
    await this.getAccounts()
    this.get_transactions()
  },
  methods: {
    async getAccounts() {
      const { data } = await this.axios.get(`/accounts`)
      this.accounts = data.accounts
    },
    get_transactions() {
      this.loading = true

      const url = `/categories/${this.category}/transactions`
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
  },
}
</script>
