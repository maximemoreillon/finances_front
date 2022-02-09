
<template>
  <v-card
    max-width="500"
    class="mx-auto">
    <v-card-title>Create category</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="create_category()">
        <v-row align="baseline">
          <v-col>
            <v-text-field
              v-model="label"
              label="Name" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon
              type="submit">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>


  </v-card>
</template>

<script>


export default {
  name: 'CreateTransactionCategory',

  data(){
    return {
      label: 'New category',

    }
  },
  mounted(){
  },
  methods: {


    create_category(){
      const url = `${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories`
      this.axios.post(url, {label: this.label})
      .then( ({data}) => {
        this.$router.push({name: 'transaction_category', params: {category_id:data. _id}})
      })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    },

  },
  computed: {

  }

}
</script>

<style scoped>


</style>
