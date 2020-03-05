<template>
  <Transactions v-bind:account="account_name"/>
</template>

<script>
// @ is an alias to /src
import Transactions from '@/components/Transactions.vue'

export default {
  name: 'BankAccountTransactions',
  components: {
    Transactions
  },
  computed: {
    account_name(){
      return process.env.VUE_APP_BANK_ACCOUNT_NAME
    },
  },

}
</script>

<style scoped>


</style>
