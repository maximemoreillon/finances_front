
<template>
  <div class="home">
    <h1>Finances manager</h1>
    <p>v1.0.0</p>


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
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transaction`, {
        params: {_id: this.$route.query._id}
      })
      .then(response => {
        this.transaction = response.data
        this.transaction_loading = false
      })
      .catch(error => console.log(error))
    },


    update_transaction(){
      this.axios.put(`${process.env.VUE_APP_FINANCES_API_URL}/transaction`, this.transaction)
      .then( () => { this.get_transaction() })
      .catch(error => console.log(error))
    },

    delete_transaction(){
      if(confirm('Delete transaction? This action is irreversible')){
        this.axios.delete(`${process.env.VUE_APP_FINANCES_API_URL}/transaction`, {params: {_id: this.transaction._id}})
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
