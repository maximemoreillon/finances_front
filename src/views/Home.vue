
<template>
  <div class="home">
    <h1>Finances manager</h1>
    <p>v1.0.0</p>
    <p>
      CLick <router-link :to="{ name: 'register_balance'}">here</router-link> to register a bank account's current balance.
    </p>


  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ViewTransaction',

  data(){
    return {

    }
  },

}
</script>

<style scoped>



</style>
