
<template>
  <div class="transaction">

    <div class="table_wrapper" v-if="transaction">
      <h1>{{transaction.description}}</h1>
      <table>
        <tr>
          <td>Account</td>
          <td>{{transaction.account}}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>{{transaction.amount}}</td>
        </tr>
        <tr>
          <td>Currency</td>
          <td>{{transaction.currency}}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>{{transaction.date}}</td>
        </tr>
        <tr>
          <td>Business expense</td>
          <td><input type="checkbox" v-model="transaction.business_expense" v-on:change="update_transaction()"/></td>
        </tr>
        <tr>
          <td>Delete</td>
          <td>
            <span
              class="transaction_delete_button"
              v-on:click="delete_transaction()">🗑️</span>
          </td>
        </tr>
      </table>
    </div>


    <div class="" v-else>
      Loading...

    </div>

  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ViewTransaction',

  data(){
    return {
      transaction: null,
      transaction_loading: false,
    }
  },
  mounted(){
    this.get_transaction()
  },
  methods: {

    get_transaction(){
      this.transaction = null
      this.transaction_loading = true
      // UPDATE TO REST API
      const url = `${process.env.VUE_APP_FINANCES_API_URL}/transaction`
      const options = {
        params: {_id: this.$route.params.transaction_id}
      }
      this.axios.get(url,options)
      .then(response => {
        this.transaction = response.data
        this.transaction_loading = false
      })
      .catch(error => console.log(error))
    },


    update_transaction(){
      // UPDATE THIS TO REST API!
      this.axios.put(`${process.env.VUE_APP_FINANCES_API_URL}/transaction`, this.transaction)
      .then( () => { this.get_transaction() })
      .catch(error => console.log(error))
    },

    delete_transaction(){
      if(!confirm('Delete transaction? This action is irreversible')) return

      this.axios.delete(`${process.env.VUE_APP_FINANCES_API_URL}/transaction`, {params: {_id: this.transaction._id}})
      .then( () => { this.$router.go(-1)})
      .catch(error => console.log(error))

    }

  },
}
</script>

<style scoped>

table {
  width: 100%;
  //max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;
  table-layout: fixed;
}


td:first-child {
  font-weight: bold;
  width: 33%;
}




td, th {
  padding: 2px;

  white-space: nowrap;

}

td:not(.amount_cell){
  overflow: hidden;
  text-overflow: ellipsis;
}

tr:not(:first-child){
  border-top: 1px solid #dddddd;
}

.transaction_delete_button{
  cursor: pointer;
}

</style>
