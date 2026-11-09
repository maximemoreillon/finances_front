<template>
  <v-dialog v-model="dialog" width="50rem">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary" class="mr-2">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Edit account</v-card-title>
      <v-form ref="form" @submit.prevent="updateAccount">
        <v-card-text>
          <AccountFormFields v-model="editedAccount" />
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" :loading="saving" color="primary">Save</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "@/axios";
import type { Account } from "@/types";
import AccountFormFields, {
  type AccountForm,
} from "@/components/AccountFormFields.vue";

const props = defineProps<{ account: Account }>();
const emit = defineEmits<{ updated: [account: Account] }>();

const dialog = ref(false);
const saving = ref(false);
const form = ref();

const fromAccount = (account: Account): AccountForm => ({
  name: account.name,
  currency: account.currency,
  icon_url: account.icon_url ?? null,
});

// Edit a copy so cancelling leaves the page untouched; reset it on every opening
const editedAccount = ref<AccountForm>(fromAccount(props.account));
watch(dialog, (open) => {
  if (open) editedAccount.value = fromAccount(props.account);
});

async function updateAccount() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  saving.value = true;
  try {
    const { data } = await axios.put<Account>(
      `/accounts/${props.account.id}`,
      // null (not "") clears the icon; clearable fields set null themselves
      { ...editedAccount.value, icon_url: editedAccount.value.icon_url || null },
    );
    emit("updated", data);
    dialog.value = false;
  } catch (error) {
    console.error(error);
    alert("Update failed");
  } finally {
    saving.value = false;
  }
}
</script>
