<template>
  <v-card class="mx-auto" max-width="60rem">
    <v-toolbar flat>
      <v-toolbar-title>Transaction categories</v-toolbar-title>
      <v-spacer />
      <CreateCategoryDialog />
    </v-toolbar>

    <v-card-text>
      <v-data-table :headers="headers" :items="categories">
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
      this.axios
        .get(`/categories`)
        .then(({ data }) => {
          this.categories = data.categories
        })
        .catch((error) => {
          console.error(error)
          alert("Error")
        })
    },
  },
}
</script>

<style scoped></style>
