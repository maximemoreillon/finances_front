<template>
  <v-card max-width="30rem" class="mx-auto" :loading="loading">
    <v-card-title>Accounts</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" v-for="account in accounts" :key="account">
          <AccountPreview :account="account" />
        </v-col>
      </v-row>
    </v-card-text>
    <TotalWealth />
  </v-card>
</template>

<script>
import AccountPreview from "../components/AccountPreview.vue"
import TotalWealth from "../components/TotalWealth.vue"
export default {
  name: "BalanceHistory",
  components: {
    AccountPreview,
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
        .get(`${process.env.VUE_APP_FINANCES_API_URL}/accounts`)
        .then(({ data }) => {
          this.accounts = data
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
