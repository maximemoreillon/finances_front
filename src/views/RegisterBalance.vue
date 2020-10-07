
<template>
  <div class="home">
    <h1>Register Balance</h1>

    <form class="" @submit.prevent="submit()">
      <p>
        <label >Account</label>
        <input type="text" v-model="account">
      </p>

      <p>
        <label >Currency</label>
        <input type="text" v-model="currency">
      </p>

      <p>
        <label >Balance</label>
        <input type="text" v-model="balance">
      </p>

      <p>
        <input type="submit">
      </p>





    </form>


  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'ViewTransaction',

  data(){
    return {
      account: '',
      currency: '',
      balance: '',
    }
  },
  methods: {
    submit(){
      let url = `${process.env.VUE_APP_FINANCES_API_URL}/balance`
      let body = {
        account: this.account,
        currency: this.currency,
        balance: this.balance,
      }
      this.axios
        .post(url,body)
        .then(() => this.$router.push({name: 'balance', query: {'account' : this.account}}))
        .catch((error) => {
          console.log(error)
        })
    }
  }

}
</script>

<style scoped>

label {
  margin-right: 0.5em;
}


</style>
