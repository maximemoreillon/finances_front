<template>
  <v-card class="mx-auto" max-width="60rem">
    <v-toolbar flat>
      <v-toolbar-title>Transaction categories</v-toolbar-title>
      <v-spacer />
      <v-btn outlined class="mr-2" :loading="applying" @click="applyCategories">
        <v-icon left>mdi-reload</v-icon>
        <span>Apply</span>
      </v-btn>
      <CreateCategoryDialog />
    </v-toolbar>

    <v-card-text>
      <v-data-table :headers="headers" :items="categories" :loading="loading">
        <template v-slot:item.name="{ item }">
          <router-link
            :to="{
              name: 'transaction_category',
              params: { categoryId: item.id },
            }"
          >
            {{ item.name }}
          </router-link>
        </template>
        <template v-slot:item.keywords="{ item }">
          <!-- TODO: make a link, requires knowing id -->
          <v-chip
            v-for="(keyword, index) in item.keywords"
            :key="`${item._id}_kw_${index}`"
            class="ma-1"
            label
            outlined
          >
            {{ keyword }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog.vue"

export default {
  name: "TransactionCategories",
  components: { CreateCategoryDialog },
  data() {
    return {
      categories: [],
      loading: false,
      applying: false,
      headers: [
        { value: "name", text: "Name" },
        { value: "keywords", text: "Keywords" },
        { value: "transaction_count", text: "Transactions" },
      ],
    }
  },
  mounted() {
    this.get_categories()
  },
  methods: {
    get_categories() {
      this.loading = true
      this.axios
        .get(`/categories`)
        .then(({ data }) => {
          this.categories = data.categories
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
        .finally(() => {
          this.loading = false
        })
    },
    async applyCategories() {
      try {
        this.applying = true
        await this.axios.patch("/categories")
        alert("Categories applied")
        this.get_categories()
      } catch (error) {
        alert("Applying categories failed")
        console.error(error)
      } finally {
        this.applying = false
      }
    },
  },
}
</script>

<style scoped></style>
