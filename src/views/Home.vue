
<template>
  <div class="home">
    <h1>Finances manager</h1>
    <h2>Balance history</h2>
    <ul>
      <li
        v-for="(account, account_index) in balance_accounts"
        v-bind:key="`balance_account_${account_index}`">
        <router-link
          v-bind:to="{ name: 'balance', query: {account: account} }">
          {{account}}
        </router-link>
      </li>
    </ul>
    <h2>Transaction history</h2>
    <ul>
      <li
        v-for="(account, account_index) in transactions_accounts"
        v-bind:key="`transaction_account_${account_index}`">
        <router-link
          v-bind:to="{ name: 'balance', query: {account: account} }">
          {{account}}
        </router-link>
      </li>
    </ul>


  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',

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

<style scoped>

a {
  color: #c00000;
  text-decoration: none;
}

li {
  margin: 0.5em 0;
}


</style>
