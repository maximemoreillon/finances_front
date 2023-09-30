<template>
  <v-card max-width="500" class="mx-auto" :loading="loading">
    <v-toolbar flat>
      <v-row align="baseline">
        <v-col cols="auto">
          <v-btn icon exact :to="{ name: 'transaction_categories' }">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-card-title>Category edit</v-card-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn icon @click="update_category()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn icon @click="delete_category()" color="#c00000">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <template v-if="category">
      <v-card-text>
        <v-text-field v-model="category.label" label="Name"></v-text-field>
      </v-card-text>

      <v-card-text>
        <h2>Keywords</h2>
        <v-row
          align="baseline"
          v-for="(keyword, index) in category.keywords"
          :key="`keyword_${index}`"
        >
          <v-col>
            <v-text-field
              v-model="category.keywords[index]"
              label="Keyword"
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn icon @click="delete_keyword(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="baseline">
          <v-col cols="auto">
            <v-btn @click="add_keyword()"> Add keyword </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "CreateTransactionCategory",

  data() {
    return {
      loading: false,
      category: null,
    }
  },
  mounted() {
    this.get_category()
  },
  methods: {
    get_category() {
      this.axios
        .get(`/transactions/categories/${this.category_id}`)
        .then((response) => {
          this.category = response.data
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
    add_keyword() {
      this.category.keywords.push("")
    },
    delete_keyword(index) {
      this.category.keywords.splice(index, 1)
    },
    create_category() {
      this.axios
        .post(`/transactions/categories`, this.category)
        .then(() => {
          this.$router.push({ name: "transaction_categories" })
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
    update_category() {
      let category_id = this.$route.params.category_id
      this.axios
        .put(`/transactions/categories/${category_id}`, this.category)
        .then(() => {
          this.$router.push({ name: "transaction_categories" })
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
    delete_category() {
      let category_id = this.$route.params.category_id
      this.axios
        .delete(`/transactions/categories/${category_id}`)
        .then(() => {
          this.$router.push({ name: "transaction_categories" })
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
  },
  computed: {
    category_id() {
      return this.$route.params.category_id
    },
  },
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
