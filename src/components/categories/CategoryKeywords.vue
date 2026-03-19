<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-toolbar-title>Keywords</v-toolbar-title>
      <v-spacer />
      <AddKeywordDialog :categoryId="categoryId" @keywordAdded="keywords.push($event)" />
    </v-toolbar>
    <v-card-text>
      <v-chip
        v-for="keyword in keywords"
        :key="keyword.id"
        label
        variant="outlined"
        closable
        class="ma-1"
        :to="{ name: 'keyword', params: { keywordId: keyword.id } }"
        @click:close="deleteKeyword(keyword.id)"
      >
        {{ keyword.word }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import type { Keyword } from "@/types"
import axios from "@/axios"
import AddKeywordDialog from "./AddKeywordDialog.vue"

const route = useRoute()

const loading = ref(false)
const keywords = ref<Keyword[]>([])

const categoryId = computed(() => route.params.categoryId as string)

async function getKeywords() {
  loading.value = true
  try {
    const { data } = await axios.get<{ keywords: Keyword[] }>(
      `/categories/${categoryId.value}/keywords`
    )
    keywords.value = data.keywords
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function deleteKeyword(keywordId: number) {
  if (!confirm("Delete keyword?")) return
  try {
    await axios.delete(`/categories/${categoryId.value}/keywords/${keywordId}`)
    const idx = keywords.value.findIndex((k) => k.id === keywordId)
    if (idx > -1) keywords.value.splice(idx, 1)
  } catch (error) {
    console.error(error)
  }
}

onMounted(getKeywords)
</script>
