<template>
  <v-dialog v-model="dialog" width="30rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon start>mdi-plus</v-icon>
        Add
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Add keyword</v-card-title>
      <v-form @submit.prevent="addKeyword">
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-text-field label="Word" v-model="word" />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="loading" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { Keyword } from "@/types"
import axios from "@/axios"

const props = defineProps<{ categoryId: string }>()
const emit = defineEmits<{ keywordAdded: [data: Keyword] }>()

const dialog = ref(false)
const word = ref("")
const loading = ref(false)

async function addKeyword() {
  loading.value = true
  try {
    const { data } = await axios.post<Keyword>(`/categories/${props.categoryId}/keywords`, {
      word: word.value,
    })
    emit("keywordAdded", data)
    dialog.value = false
    word.value = ""
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    loading.value = false
  }
}
</script>
