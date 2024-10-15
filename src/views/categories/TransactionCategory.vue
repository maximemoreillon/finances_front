<template>
  <v-card max-width="50rem" class="mx-auto" :loading="loading">
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
          <v-btn icon @click="update_category()" disabled>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            icon
            @click="deleteCategory()"
            color="#c00000"
            :loading="deleting"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <template v-if="category">
      <v-card-text>
        <v-text-field v-model="category.name" label="Name"></v-text-field>
      </v-card-text>

      <v-card-text>
        <v-row align="center">
          <v-col cols="auto">
            <h3 class="my-4">Keywords</h3>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <AddKeywordDialog
              :categoryId="categoryId"
              @keywordAdded="category.keywords.push($event)"
            />
          </v-col>
        </v-row>
        <v-row
          align="baseline"
          v-for="(keyword, index) in category.keywords"
          :key="`keyword_${keyword.id}`"
        >
          <v-col>
            <v-text-field
              v-model="category.keywords[index].word"
              label="Keyword"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn icon @click="deleteKeyword(keyword.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import AddKeywordDialog from "../../components/AddKeywordDialog.vue"
export default {
  name: "CreateTransactionCategory",
  components: {
    AddKeywordDialog,
  },

  data() {
    return {
      loading: false,
      deleting: false,
      category: null,
    }
  },
  mounted() {
    this.get_category()
  },
  methods: {
    get_category() {
      this.axios
        .get(`/categories/${this.categoryId}`)
        .then((response) => {
          this.category = response.data
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
    add_keyword() {
      alert("WIP")
      // this.category.keywords.push("")
    },
    async deleteKeyword(keywordId) {
      if (!confirm("Delete keyword?")) return

      await this.axios.delete(
        `/categories/${this.categoryId}/keywords/${keywordId}`
      )
      const foundIndex = this.category.keywords.findIndex(
        (k) => k.id === keywordId
      )
      if (foundIndex > -1) this.category.keywords.splice(foundIndex, 1)
    },
    update_category() {
      alert("WIP")
      // let categoryId = this.$route.params.categoryId
      // this.axios
      //   .put(`/transactions/categories/${categoryId}`, this.category)
      //   .then(() => {
      //     this.$router.push({ name: "transaction_categories" })
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //     alert("Error")
      //   })
    },
    async deleteCategory() {
      if (!confirm("Delete category?")) return
      this.deleting = true
      try {
        await this.axios.delete(`/categories/${this.categoryId}`)
        this.$router.push({ name: "transaction_categories" })
      } catch (error) {
        console.error(error)
        alert("Error")
      } finally {
        this.deleting = false
      }
    },
  },
  computed: {
    categoryId() {
      return this.$route.params.categoryId
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
