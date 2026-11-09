<template>
  <v-dialog v-model="dialog" width="50rem">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        prepend-icon="mdi-plus"
        text="Create"
      >
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Create account</v-card-title>
      <v-form ref="form" @submit.prevent="createAccount">
        <v-card-text>
          <AccountFormFields v-model="newAccount" />
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
import { useRouter } from "vue-router";
import axios from "@/axios";
import AccountFormFields, {
  type AccountForm,
} from "@/components/AccountFormFields.vue";

const router = useRouter();

const dialog = ref(false);
const registering = ref(false);
const form = ref();
const newAccount = ref<AccountForm>({ name: "", currency: "JPY", icon_url: null });

async function createAccount() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  registering.value = true;
  try {
    const { data } = await axios.post<{ id: number }>("/accounts", {
      ...newAccount.value,
      icon_url: newAccount.value.icon_url || null,
    });
    router.push({ name: "account", params: { accountId: data.id } });
  } catch (error) {
    console.error(error);
    alert("Error");
  } finally {
    registering.value = false;
  }
}
</script>
