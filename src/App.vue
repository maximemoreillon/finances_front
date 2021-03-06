<template>
  <div id="app">

    <AppTemplate applicationName="Finances">

      <template v-slot:navigation>

        <router-link to="/">
          <home-icon />
          <span>Home</span>
        </router-link>

        <router-link to="/about">
          <InformationOutlineIcon />
          <span>About</span>
        </router-link>

        <span class="nav_separator">Balance</span>

        <router-link
          v-for="(account, account_index) in balance_accounts"
          v-bind:key="`balance_account_${account_index}`"
          v-bind:to="{ name: 'balance', params: {account: account} }">
          <chart-line-icon />
          <span>{{account}}</span>
        </router-link>

        <span class="nav_separator">Transactions</span>

        <!-- Transaction accounts -->
        <router-link
          v-for="(account, account_index) in transactions_accounts"
          v-bind:key="`transaction_account_${account_index}`"
          v-bind:to="{ name: 'transactions', params: {account: account} }">
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
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'


export default {
  name: 'app',
  components: {
    AppTemplate,
    ChartDonutIcon,
    ChartLineIcon,
    HomeIcon,
    InformationOutlineIcon,
  },


  data(){
    return {
      transactions_accounts: [],
      balance_accounts: [],
    }
  },
  mounted(){
    this.get_balance_accounts()
    this.get_transaction_accounts()
  },
  methods: {
    get_balance_accounts(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/balance_accounts`)
      .then( response => {
        this.balance_accounts = []
        response.data.forEach((account) => {
          this.balance_accounts.push(account.name)
        })
      })
      .catch(error => {
        if(error.response) console.log(error.response.data)
        console.error(error)
      })
    },
    get_transaction_accounts(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transaction_accounts`)
      .then( response => {
        this.transactions_accounts = []
        response.data.forEach((account) => {
          this.transactions_accounts.push(account)
        })
      })
      .catch(error => console.error(error))
    },
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

button,
.button {
  font-size: 85%;
  text-decoration: none;
  color: currentColor;
  border: 1px solid #444444;
  border-radius: 0.33em;
  padding: 0.33em;
  background-color: transparent;

  transition: 0.25s;
  cursor: pointer;
}

button:hover,
.button:hover {
  border-color: #c00000;
  color: #c00000;
}

.dangerous {
  color: #c00000;
  border-color: #c00000;
  transition: 0.25s;
}

.dangerous:hover {
  color: white;
  background-color: #c00000;
}

h1 {
  text-transform: uppercase;
}


</style>
