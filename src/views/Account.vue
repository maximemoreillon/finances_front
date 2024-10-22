<template>
  <div>
    <v-row>
      <v-col>
        <v-card :loading="loading">
          <v-toolbar flat>
            <v-toolbar-title v-if="account">{{ account.name }}</v-toolbar-title>
            <v-progress-circular indeterminate v-else />

            <v-spacer />
            <v-btn @click="updateAccount()" icon>
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn @click="deleteAccount()" color="#c00000" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text v-if="account">
            <v-row>
              <v-col>
                <v-text-field label="Name" v-model="account.name" />
              </v-col>
              <v-col>
                <v-text-field v-model="account.currency" label="Currency" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AccountBalanceHistory :currency="account?.currency" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <AccountMonthlyExpensesTotal />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ExpensesBreakdown />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AccountTransactionsTable />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AccountBalanceHistory from "@/components/AccountBalanceHistory.vue"
import AccountTransactionsTable from "@/components/TransactionsTable.vue"
import AccountMonthlyExpensesTotal from "@/components/TransactionsBarChart.vue"
import ExpensesBreakdown from "@/components/ExpensesBreakdown.vue"
import queryParamsUtils from "../mixins/queryParamsUtils"
export default {
  name: "Account",
  components: {
    AccountBalanceHistory,
    AccountTransactionsTable,
    AccountMonthlyExpensesTotal,
    ExpensesBreakdown,
  },
  mixins: [queryParamsUtils],
  data() {
    return {
      account: null,
      deleting: false,
      loading: false,
      saving: false,
    }
  },
  watch: {
    accountId() {
      this.getAccountInfo()
    },
  },

  mounted() {
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo() {
      this.loading = false
      try {
        const { data } = await this.axios.get(`/accounts/${this.accountId}`)
        this.account = data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async updateAccount() {
      this.saving = false
      try {
        await this.axios.put(`/accounts/${this.accountId}`, this.account)
      } catch (error) {
        alert("Update failed")
        console.error(error)
      } finally {
        this.saving = false
      }
    },
    async deleteAccount() {
      if (!confirm(`Delete account?`)) return
      this.deleting = false
      try {
        await this.axios.delete(`/accounts/${this.accountId}`)
        this.$router.push("/accounts")
      } catch (error) {
        console.error(error)
      } finally {
        this.deleting = false
      }
    },
  },
  computed: {
    accountId() {
      return this.$route.params.accountId
    },
  },
}
</script>

<style scoped></style>
