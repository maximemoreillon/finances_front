
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
    }
  },
  mounted(){
    this.axios.post('https://finances.maximemoreillon.com/get_transaction', {
      _id: this.$route.query._id
    })
    .then(response => {
      console.log(response.data)
      // Might not be reactive!
      this.transaction = response.data
    })
    .catch(error => console.log(error.data))
  },
  methods: {

    update_transaction(){
      this.axios.post('https://finances.maximemoreillon.com/update_transaction', this.transaction)
      .then(response => {

        console.log(response.data)
      })
      .catch(error => console.log(error.data))
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

</style>
