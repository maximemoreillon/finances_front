<template>
  <v-card
    :loading="loading">

    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>Accounts</v-card-title>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <v-row>
        <v-col
          v-for="account in accounts"
          :key="account">
          <v-card
            outlined
            :to="{name: 'account', params: {account}}">
            <v-card-title>{{account.toUpperCase()}}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<script>

export default {
  name: 'BalanceHistory',
  components: {

  },
  data(){
    return {
      loading: false,
      accounts: [],

    }
  },

  mounted(){
    this.get_accounts()
  },
  methods: {
    get_accounts(){
      this.loading = true
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/accounts`)
      .then( ({data}) => { this.accounts = data })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        console.error(error)
      })
      .finally(() => {this.loading = false})
    },
  },
  computed: {

  }
}
</script>

<style scoped>


</style>
