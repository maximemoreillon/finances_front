<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-card-title>Transaction categories</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn exact :to="{ name: 'new_transaction_category' }">
            New category
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <router-link
        class="category"
        v-for="category in categories"
        v-bind:key="category._id"
        :to="{
          name: 'transaction_category',
          params: { category_id: category._id },
        }"
      >
        <span>{{ category.label }}</span>

        <span class="spacer" />

        <div class="keyword_container">
          <span
            class="keyword"
            v-for="(keyword, index) in category.keywords"
            v-bind:key="`${category._id}_kw_${index}`"
          >
            {{ keyword }}
          </span>
        </div>
      </router-link>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TransactionCategories",

  data() {
    return {
      categories: [],
    }
  },
  mounted() {
    this.get_categories()
  },
  methods: {
    get_categories() {
      this.axios
        .get(`/transactions/categories`)
        .then((response) => {
          this.categories = response.data
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
  },
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

.keyword:not(:last-child) {
  margin-right: 0.25em;
}
</style>
