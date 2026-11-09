<template>
  <v-avatar :size="size" :rounded="iconUrl && !failed ? 'sm' : undefined">
    <v-img v-if="iconUrl && !failed" :src="iconUrl" @error="failed = true" />
    <v-icon v-else>mdi-bank</v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{ iconUrl?: string | null; size?: number | string }>(),
  { size: 40 },
);

// Fall back to the generic icon when the image can't be loaded; retry if the URL changes
const failed = ref(false);
watch(
  () => props.iconUrl,
  () => (failed.value = false),
);
</script>
