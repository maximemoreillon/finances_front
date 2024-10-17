<template>
  <v-card max-width="40rem" class="mx-auto" :loading="loading">
    <v-toolbar flat>
      <v-btn icon exact :to="{ name: 'transaction_categories' }">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Category</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="update_category()" disabled>
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn icon @click="deleteCategory()" color="#c00000" :loading="deleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <template v-if="category">
        <v-row>
          <v-col>
            <v-text-field v-model="category.name" label="Name"></v-text-field>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="auto">
            <h3 class="my-4">Keywords</h3>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <AddKeywordDialog
              :categoryId="String(categoryId)"
              @keywordAdded="category.keywords.push($event)"
            />
          </v-col>
        </v-row>

        <v-chip
          v-for="keyword in category.keywords"
          :key="keyword.id"
          label
          outlined
          close
          class="ma-1"
          @click:close="deleteKeyword(keyword.id)"
        >
          {{ keyword.word }}
        </v-chip>
      </template>
    </v-card-text>
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
