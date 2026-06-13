<template>
  <v-dialog v-model="dialog" width="30rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Register balance</v-card-title>
      <v-form @submit.prevent="registerBalance" ref="form">
        <v-card-text>
          <v-row justify="center">
            <v-col>
              <v-text-field
                v-model="balance"
                label="Balance"
                :rules="[validateNumberWithCommas]"
                :prefix="currency"
              />
            </v-col>
          </v-row>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="registering" color="primary"
                >Save</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "@/axios";
import z from "zod";

const props = defineProps<{ accountId: string; currency?: string }>();
const emit = defineEmits<{ balanceRegistered: [data: unknown] }>();

const dialog = ref(false);
const registering = ref(false);
const balance = ref(0);
const form = ref();

const cleanNumberSchema = z
  .union([
    z.number(),
    z.string().transform((str) => Number(str.replace(/,/g, ""))),
  ])
  .pipe(z.number());

const validateNumberWithCommas = (value: any) => {
  if (value === null || value === undefined || value === "") return true;

  const result = cleanNumberSchema.safeParse(value);

  if (result.success) return true;
  else {
    return "Malformed number";
  }
};

async function registerBalance() {
  registering.value = true;

  try {
    const cleanedBalance = cleanNumberSchema.parse(balance.value);

    const { data } = await axios.post(`/accounts/${props.accountId}/balance/`, {
      balance: cleanedBalance,
    });
    emit("balanceRegistered", data);
    dialog.value = false;
  } catch (error) {
    console.error(error);
    alert("Error");
  } finally {
    registering.value = false;
  }
}
</script>
