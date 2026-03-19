<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Register transaction</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registerTransaction">
          <v-row>
            <v-col>
              <v-text-field v-model="newTransaction.description" label="Description" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.number="newTransaction.amount"
                label="Amount"
                type="number"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="newTransaction.time" label="Date" type="date" />
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
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import axios from "@/axios"

const props = defineProps<{ accountId: string }>()
const emit = defineEmits<{ transactionRegistered: [data: unknown] }>()

const dialog = ref(false)
const registering = ref(false)
const newTransaction = ref({ description: "", time: "", amount: 0 })

async function registerTransaction() {
  registering.value = true
  try {
    const { data } = await axios.post(
      `/accounts/${props.accountId}/transactions/`,
      newTransaction.value
    )
    emit("transactionRegistered", data)
    dialog.value = false
    newTransaction.value = { description: "", time: "", amount: 0 }
  } catch (error) {
    console.error(error)
    alert("Error")
  } finally {
    registering.value = false
  }
}
</script>
