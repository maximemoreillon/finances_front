
<template>
  <v-card :loading="loading" max-width="50rem" class="mx-auto">

    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          <v-btn icon :to="{name: 'account', params: {account: this.account}}" exact>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-toolbar-title>
            Transaction
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn icon @click="update_transaction()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="#c00000" icon @click="delete_transaction()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>


    <v-card-text v-if="transaction">
      <v-row>
        <v-col>
          <v-text-field label="Description" v-model="transaction.description"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="ID" v-model="transaction._id" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="Currency" v-model="transaction.currency"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field label="Amount" type="number" v-model.number="transaction.amount"></v-text-field>
        </v-col>

      </v-row>
      <v-row>
        <v-col>
          <v-checkbox label="Business expense" v-model="transaction.business_expense"></v-checkbox>
        </v-col>
      </v-row>

    </v-card-text>

  </v-card>
</template>

<script>

export default {
  name: 'Transaction',

  data(){
    return {
      transaction: null,
      loading: false,
    }
  },
  mounted(){
    this.get_transaction()
  },
  methods: {

    get_transaction(){
      this.transaction = null
      this.loading = true

      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.transaction = data
        this.loading = false
      })
      .catch(error => console.log(error))
    },


    update_transaction(){
      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios.patch(url, this.transaction)
      .then( () => { this.get_transaction() })
      .catch(error => console.log(error))
    },

    delete_transaction(){
      if(!confirm('Delete transaction? This action is irreversible')) return
      const url = `${process.env.VUE_APP_FINANCES_API_URL}/accounts/${this.account}/transactions/${this.transaction_id}`
      this.axios.delete(url)
      .then( () => { this.$router.go(-1)})
      .catch(error => console.log(error))

    }

  },
  computed: {
    account(){
      return this.$route.params.account
    },
    transaction_id() {
      return this.$route.params.transaction_id
    },
  }
}
</script>

<style scoped>


</style>
