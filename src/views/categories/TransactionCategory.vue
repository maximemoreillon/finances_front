<template>
  <div>
    <v-row>
      <v-col>
        <v-card>
          <v-toolbar flat>
            <v-btn icon exact :to="{ name: 'transaction_categories' }">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Category</v-toolbar-title>
            <v-spacer />
            <v-btn icon @click="updateCategory" :loading="saving">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon @click="deleteCategory" color="#c00000" :loading="deleting">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text v-if="category">
            <v-row>
              <v-col>
                <v-text-field v-model="category.name" label="Name" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <CategoryKeywords />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsBarChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsTable />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.message }}</v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Category } from "@/types"
import axios from "@/axios"
import TransactionsTable from "@/components/TransactionsTable.vue"
import CategoryKeywords from "@/components/categories/CategoryKeywords.vue"
import TransactionsBarChart from "@/components/TransactionsBarChart.vue"

const route = useRoute()
const router = useRouter()

const category = ref<Category | null>(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const snackbar = ref({ show: false, message: "", color: "" })

function showSnackbar(message: string, color = "") {
  snackbar.value = { show: true, message, color }
}

const categoryId = computed(() => route.params.categoryId as string)

async function getCategory() {
  loading.value = true
  try {
    const { data } = await axios.get<Category>(`/categories/${categoryId.value}`)
    category.value = data
  } catch (error) {
    console.error(error)
    showSnackbar("Failed to load category", "error")
  } finally {
    loading.value = false
  }
}

async function updateCategory() {
  saving.value = true
  try {
    await axios.put(`/categories/${categoryId.value}`, category.value)
    showSnackbar("Category updated successfully", "success")
  } catch (error) {
    console.error(error)
    showSnackbar("Failed to update category", "error")
  } finally {
    saving.value = false
  }
}

async function deleteCategory() {
  if (!confirm("Delete category?")) return
  deleting.value = true
  try {
    await axios.delete(`/categories/${categoryId.value}`)
    router.push({ name: "transaction_categories" })
  } catch (error) {
    console.error(error)
    showSnackbar("Failed to delete category", "error")
  } finally {
    deleting.value = false
  }
}

onMounted(getCategory)
</script>
