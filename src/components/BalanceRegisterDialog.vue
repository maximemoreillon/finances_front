<template>
  <v-dialog v-model="dialog" width="30rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Register balance</v-card-title>
      <v-form @submit.prevent="registerBalance">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field
                type="number"
                v-model.number="balance"
                label="Balance"
                :prefix="currency"
              />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="registering" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import axios from "@/axios"

const props = defineProps<{ accountId: string; currency?: string }>()
const emit = defineEmits<{ balanceRegistered: [data: unknown] }>()

const dialog = ref(false)
const registering = ref(false)
const balance = ref(0)

async function registerBalance() {
  registering.value = true
  try {
    const { data } = await axios.post(`/accounts/${props.accountId}/balance/`, {
      balance: balance.value,
    })
    emit("balanceRegistered", data)
    dialog.value = false
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    registering.value = false
  }
}
</script>
