<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Accounts</v-toolbar-title>
      <v-spacer />
      <CreateAccountDialog />
    </v-toolbar>
    <v-card-text>
      <h3>Summary</h3>

      <TotalWealth />

      <v-row>
        <v-col cols="12" md="6" v-for="account in accounts" :key="account.id">
          <AccountPreview :account="account" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import AccountPreview from "../components/AccountPreview.vue"
import TotalWealth from "../components/TotalWealth.vue"
import CreateAccountDialog from "../components/CreateAccountDialog.vue"
export default {
  name: "BalanceHistory",
  components: {
    AccountPreview,
    CreateAccountDialog,
    TotalWealth,
  },
  data() {
    return {
      loading: false,
      accounts: [],
    }
  },

  mounted() {
    this.get_accounts()
  },
  methods: {
    get_accounts() {
      this.loading = true
      this.axios
        .get(`/accounts`)
        .then(({ data }) => {
          this.accounts = data.accounts
        })
        .catch((error) => {
          if (error.response) console.log(error.response.data)
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {},
}
</script>

<style scoped></style>
