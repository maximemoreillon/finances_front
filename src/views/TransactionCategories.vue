
<template>
  <div class="home">
    <h1>Categories</h1>
    <p>
      <router-link
        class="button"
        :to="{ name: 'transaction_category', params: {category_id: 'new'}}">
        Create category
      </router-link>
    </p>



    <div class="categories_wrapper">
      <router-link
        class="category"
        v-for="category in categories"
        v-bind:key="category._id"
        :to="{ name: 'transaction_category', params: {category_id: category._id} }">
        <span>{{category.label}}</span>

        <span class="spacer"/>

        <div class="keyword_container">
          <span
            class="keyword"
            v-for="(keyword, index) in category.keywords"
            v-bind:key="`${category._id}_kw_${index}`">
            {{keyword}}
          </span>

        </div>

      </router-link>
    </div>








  </div>
</template>

<script>


export default {
  name: 'TransactionCategories',

  data(){
    return {
      categories: [],

    }
  },
  mounted(){
    this.get_categories()
  },
  methods: {
    get_categories(){
      this.axios.get(`${process.env.VUE_APP_FINANCES_API_URL}/transactions/categories`)
      .then( response => {
        this.categories = response.data
      })
      .catch(error => {
        console.error(error)
        alert('Error')
      })
    }
  }

}
</script>

<style scoped>

.category {
  margin: 0.25em 0;
  padding: 0.25em;
  display: flex;
  color: currentcolor;
  text-decoration: none;
  border: 1px solid #dddddd;

}

.spacer {
  flex-grow: 1;
}

.keyword:not(:last-child){
  margin-right: 0.25em;
}

</style>
