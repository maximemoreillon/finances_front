<template>
  <AppTemplate
    @user="get_user($event)"
    :options="options">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          :value="false"
          no-action
          prepend-icon="mdi-chart-line">

          <template v-slot:activator>
            <v-list-item-title>Accounts</v-list-item-title>
          </template>

          <v-list-item
            v-for="(account, account_index) in accounts"
            :key="`account_${account_index}`"
            :to="{ name: 'account', params: {account} }"
            exact>
            <v-list-item-icon>
              <v-icon>mdi-chart-line</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{account.toUpperCase()}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>



      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    transactions_accounts: [],
    balance_accounts: [],

    accounts: [],
    loading: false,

    options: {
      title: "Finances",
      skip_greetings: process.env.NODE_ENV === 'development',
      login_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
      identification_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/whoami`
    },
    nav: [
      {title: 'Home', to: {name: 'home'}, icon: 'mdi-home'},
      {title: 'About', to: {name: 'about'}, icon: 'mdi-information-outline'},
    ]
  }),

  methods: {
    get_user(user){
      if(!user) return
      this.get_accounts()
      this.get_balance_accounts()
      this.get_transaction_accounts()
    },
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
    get_balance_accounts(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/balance/accounts`)
      .then( ({data}) => { this.balance_accounts = data })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        console.error(error)
      })
    },
    get_transaction_accounts(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transactions/accounts`)
      .then( ({data}) => { this.transactions_accounts = data })
      .catch(error => console.error(error))
    },

  }
};
</script>

<style>
.apexcharts-toolbar {
  z-index: 0 !important;
}
</style>
