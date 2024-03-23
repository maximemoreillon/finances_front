<template>
  <v-card class="mx-auto" max-width="50rem">
    <v-card-title> Finances manager </v-card-title>
    <v-card-subtitle> Version {{ version }} </v-card-subtitle>
    <v-card-text>
      A finance management system developed and maintained by Maxime MOREILLON
    </v-card-text>
  </v-card>
</template>

<script>
// @ is an alias to /src
import pjson from "../../package.json"

export default {
  name: "ViewTransaction",

  data() {
    return {
      version: pjson.version,
    }
  },
}
</script>

<style scoped></style>
