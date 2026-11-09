<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="model.name"
        label="Account name"
        :rules="[required, maxLength]"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <v-text-field
        v-model="model.currency"
        label="Currency"
        :rules="[required, maxLength]"
      />
    </v-col>
  </v-row>
  <v-row align="center">
    <v-col cols="auto">
      <AccountIcon :icon-url="validIconUrl" size="56" />
    </v-col>
    <v-col>
      <v-text-field
        v-model="model.icon_url"
        label="Icon URL"
        placeholder="https://example.com/logo.png"
        hint="Optional. Leave empty for the default icon"
        persistent-hint
        clearable
        :rules="[httpUrl]"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AccountIcon from "@/components/AccountIcon.vue";

export interface AccountForm {
  name: string;
  currency: string;
  icon_url: string | null;
}

const model = defineModel<AccountForm>({ required: true });

// Mirrors the API's validation (VARCHAR(50) columns, http(s) icon URLs)
const required = (value: string) => !!value?.trim() || "Required";
const maxLength = (value: string) =>
  (value?.length ?? 0) <= 50 || "50 characters max";

const isHttpUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
const httpUrl = (value: string | null) =>
  !value || isHttpUrl(value) || "Must be an http(s) URL";

// Only preview URLs the API would accept
const validIconUrl = computed(() =>
  model.value.icon_url && isHttpUrl(model.value.icon_url)
    ? model.value.icon_url
    : null,
);
</script>
