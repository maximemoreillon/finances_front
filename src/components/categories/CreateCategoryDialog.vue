<template>
  <v-dialog v-model="dialog" width="50rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon start>mdi-plus</v-icon>
        New
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Create transaction category</v-card-title>
      <v-form @submit.prevent="createCategory">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field v-model="name" label="Category name" />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="registering" color="primary">Register</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "@/axios"

const router = useRouter()

const dialog = ref(false)
const registering = ref(false)
const name = ref("")

async function createCategory() {
  registering.value = true
  try {
    const { data } = await axios.post<{ id: number }>("/categories", { name: name.value })
    router.push({ name: "transaction_category", params: { categoryId: data.id } })
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    registering.value = false
  }
}
</script>
