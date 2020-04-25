
<template>
  <div class="transaction">

    <div class="table_wrapper" v-if="transaction">
      <table>
        <tr>
          <td>Description</td>
          <td>{{transaction.description}}</td>
        </tr>
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
      this.axios.post(`${process.env.VUE_APP_FINANCES_API_URL}/get_transaction`, {
        _id: this.$route.query._id
      })
      .then(response => {
        this.transaction = response.data
        this.transaction_loading = false
      })
      .catch(error => console.log(error))
    },


    update_transaction(){
      this.axios.post(`${process.env.VUE_APP_FINANCES_API_URL}/update_transaction`, this.transaction)
      .then( () => { this.get_transaction() })
      .catch(error => console.log(error))
    },

    delete_transaction(){
      if(confirm('Delete transaction? This action is irreversible')){
        this.axios.post(`${process.env.VUE_APP_FINANCES_API_URL}/delete_transaction`, this.transaction)
        .then( () => { this.$router.push({ name: 'balance' }) })
        .catch(error => console.log(error))
      }

    }

  },
}
</script>

<style scoped>

table {
  width: 100%;
  max-width: 800px;
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
