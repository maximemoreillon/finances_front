
<template>
  <div class="home">
    <h1>Create category</h1>

    <p>
      <label for="">Label</label>
      <input type="text" v-model="category.label" placeholder="label">
    </p>



    <h2>Keywords</h2>

    <p
      v-for="(keyword,index) in category.keywords"
      :key="`keyword_${index}`">

      <input type="text" v-model="category.keywords[index]" placeholder="keyword">
      <button type="button" @click="delete_keyword(index)">delete</button>

    </p>

    <p>
      <button type="button" @click="add_keyword()">
        Add keyword
      </button>
    </p>

    <h2>Actions</h2>
    <p>
      <router-link
        class="button"
        :to="{ name: 'transaction_categories'}">
        Back to categories
      </router-link>


    </p>
    <p>
      <button
        v-if="new_category"
        type="button" @click="create_category()">
        Create category
      </button>

      <button
        v-else
        type="button" @click="update_category()">
        Save modifications
      </button>

    </p>
    <p>

      <button
        class="dangerous"
        v-if="!new_category"
        type="button" @click="delete_category()">
        Delete category
      </button>
    </p>











  </div>
</template>

<script>


export default {
  name: 'CreateTransactionCategory',

  data(){
    return {
      category: {
        label: '',
        keywords: [''],
      }

    }
  },
  mounted(){
     if(!this.new_category) this.get_category()
  },
  methods: {
    get_category(){
      let category_id = this.$route.params.category_id
      this.axios.get(
        `${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories/${category_id}`)
      .then( response => { this.category = response.data })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    },
    add_keyword(){
      this.category.keywords.push('');
    },
    delete_keyword(index){
      this.category.keywords.splice(index,1)
    },
    create_category(){
      this.axios.post(
        `${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories`,
        this.category)
      .then( () => { this.$router.push({name: 'transaction_categories'}) })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    },
    update_category(){
      let category_id = this.$route.params.category_id
      this.axios.put(
        `${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories/${category_id}`,
        this.category)
      .then( () => { this.$router.push({name: 'transaction_categories'}) })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    },
    delete_category(){
      let category_id = this.$route.params.category_id
      this.axios.delete(`${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories/${category_id}`)
      .then( () => { this.$router.push({name: 'transaction_categories'}) })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    },
  },
  computed: {
    new_category(){
      if(!this.$route.params.category_id) return true
      if(this.$route.params.category_id === 'new') return true
      return false
    }
  }

}
</script>

<style scoped>

input:not(:first-child) {
  margin-left: 0.5em;
}

input:not(:last-child) {
  margin-right: 0.5em;
}


</style>
