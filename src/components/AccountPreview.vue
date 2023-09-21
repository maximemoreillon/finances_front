<template>
  <v-card :loading="loading">
    <v-card-title> {{ account }} </v-card-title>
    <v-card-text> </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AccountPreview",
  props: {
    account: String,
  },
  data() {
    return {
      balance: 0,
      currency: "",
      loading: false,
    }
  },
}
</script>
