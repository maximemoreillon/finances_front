<template>
  <Transactions v-bind:account="account_name"/>
</template>

<script>
// @ is an alias to /src
import Transactions from '@/components/Transactions.vue'

export default {
  name: 'CreditCardTransactions',
  components: {
    Transactions
  },
  computed: {
    account_name(){
      return process.env.VUE_APP_CREDIT_CARD_ACCOUNT_NAME
    },
  },

}
</script>

<style scoped>


</style>
