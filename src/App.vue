<template>
  <div id="app">

    <AppTemplate applicationName="Finances">

      <template v-slot:navigation>

        <router-link to="/">
          <home-icon />
          <span>Home</span>
        </router-link>

        <span class="nav_separator">Balance</span>

        <router-link
        v-for="(account, account_index) in balance_accounts"
        v-bind:key="`balance_account_${account_index}`"
        v-bind:to="{ name: 'balance', query: {account: account} }">
          <chart-line-icon />
          <span>{{account}}</span>
        </router-link>

        <span class="nav_separator">Transactions</span>

        <!-- Transaction accounts -->
        <router-link
        v-for="(account, account_index) in transactions_accounts"
        v-bind:key="`transaction_account_${account_index}`"
        v-bind:to="{ name: 'transactions', query: {account: account} }">
          <chart-donut-icon />
          <span>{{account}}</span>
        </router-link>


      </template>

      <router-view/>

    </AppTemplate>

  </div>
</template>

<script>
//import AppTemplate from '@/components/vue_application_template/AppTemplate.vue'
import AppTemplate from '@moreillon/vue_application_template'

import HomeIcon from 'vue-material-design-icons/Home.vue'
import ChartDonutIcon from 'vue-material-design-icons/ChartDonut.vue'
import ChartLineIcon from 'vue-material-design-icons/ChartLine.vue'

import accounts_config from '@/accounts_config.js'

export default {
  name: 'app',
  components: {
    AppTemplate,
    ChartDonutIcon,
    ChartLineIcon,
    HomeIcon,
  },


  data(){
    return {
      transactions_accounts: accounts_config.transactions_accounts,
      balance_accounts: accounts_config.balance_accounts,
    }
  }
}
</script>


<style>
main {
  margin: 1em;
}

.nav_separator {
  text-align: center;
  font-size: 120%;
  color: #c00000;
  padding: 15px;
  margin-top: 15px;
}
</style>
