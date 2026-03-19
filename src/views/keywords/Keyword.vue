<template>
  <v-card class="mx-auto" max-width="30rem">
    <v-toolbar flat>
      <v-btn
        icon
        :to="
          keyword
            ? {
                name: 'transaction_category',
                params: { categoryId: keyword.category_id },
              }
            : undefined
        "
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Keyword</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="updateKeyword" :loading="saving">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn icon @click="deleteKeyword" color="#c00000" :loading="deleting">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text v-if="keyword">
      <v-row>
        <v-col>
          <v-text-field v-model="keyword.word" label="Word" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Keyword } from "@/types"
import axios from "@/axios"

const route = useRoute()
const router = useRouter()

const keyword = ref<Keyword | null>(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const keywordId = computed(() => route.params.keywordId as string)

async function getKeyword() {
  loading.value = true
  try {
    const { data } = await axios.get<Keyword>(`/keywords/${keywordId.value}`)
    keyword.value = data
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    loading.value = false
  }
}

async function updateKeyword() {
  saving.value = true
  try {
    await axios.put(`/keywords/${keywordId.value}`, keyword.value)
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    saving.value = false
  }
}

async function deleteKeyword() {
  if (!confirm("Delete keyword?")) return
  deleting.value = true
  try {
    await axios.delete(`/keywords/${keywordId.value}`)
    router.push({
      name: "transaction_category",
      params: { categoryId: keyword.value!.category_id },
    })
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    deleting.value = false
  }
}

onMounted(getKeyword)
</script>
