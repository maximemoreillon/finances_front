<template>
  <v-card class="mx-auto" max-width="60rem">
    <v-toolbar flat>
      <v-toolbar-title>Transaction categories</v-toolbar-title>
      <v-spacer />
      <v-btn variant="outlined" class="mr-2" :loading="applying" @click="applyCategories">
        <v-icon start>mdi-reload</v-icon>
        Apply
      </v-btn>
      <CreateCategoryDialog />
    </v-toolbar>

    <v-card-text>
      <v-data-table :headers="headers" :items="categories" :loading="loading">
        <template #item.name="{ item }">
          <router-link
            :to="{
              name: 'transaction_category',
              params: { categoryId: item.id },
            }"
          >
            {{ item.name }}
          </router-link>
        </template>
        <template #item.keywords="{ item }">
          <v-chip
            v-for="keyword in item.keywords"
            :key="keyword.id"
            class="ma-1"
            label
            variant="outlined"
            :to="{ name: 'keyword', params: { keywordId: keyword.id } }"
          >
            {{ keyword.word }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Category } from "@/types"
import axios from "@/axios"
import CreateCategoryDialog from "@/components/categories/CreateCategoryDialog.vue"

const categories = ref<Category[]>([])
const loading = ref(false)
const applying = ref(false)

const headers = [
  { key: "name", title: "Name" },
  { key: "keywords", title: "Keywords", sortable: false },
  { key: "transaction_count", title: "Transactions" },
]

async function getCategories() {
  loading.value = true
  try {
    const { data } = await axios.get<{ categories: Category[] }>("/categories")
    categories.value = data.categories
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    loading.value = false
  }
}

async function applyCategories() {
  applying.value = true
  try {
    await axios.patch("/categories")
    alert("Categories applied")
    await getCategories()
  } catch (error) {
    alert("Applying categories failed")
    console.error(error)
  } finally {
    applying.value = false
  }
}

onMounted(getCategories)
</script>
