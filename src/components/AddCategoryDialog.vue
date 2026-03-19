<template>
  <v-dialog v-model="dialog" width="50rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon start>mdi-plus</v-icon>
        Add
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Add category</v-card-title>
      <v-form @submit.prevent="addCategory">
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-select
                :items="categories"
                v-model="categoryId"
                item-title="name"
                item-value="id"
                label="Category"
              />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="adding" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { Category } from "@/types"
import axios from "@/axios"

const props = defineProps<{ accountId: string; transactionId: string }>()
const emit = defineEmits<{ categoryAdded: [data: unknown] }>()

const dialog = ref(false)
const categoryId = ref<number | null>(null)
const adding = ref(false)
const categories = ref<Category[]>([])

async function getCategories() {
  const { data } = await axios.get<{ categories: Category[] }>("/categories")
  categories.value = data.categories
}

async function addCategory() {
  adding.value = true
  try {
    const { data } = await axios.post(
      `/accounts/${props.accountId}/transactions/${props.transactionId}/categories`,
      { category_id: categoryId.value }
    )
    emit("categoryAdded", data)
    dialog.value = false
    categoryId.value = null
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    adding.value = false
  }
}

onMounted(getCategories)
</script>
