<template>
  <div id="app">

    <AppTemplate
      v-bind:navigation="navigation"
      applicationName="Finances"/>

  </div>
</template>

<script>
//import AppTemplate from '@/components/vue_application_template/AppTemplate.vue'
import AppTemplate from '@moreillon/vue_application_template'

export default {
  name: 'app',
  components: {
    AppTemplate,
  },
  data(){
    return {
      navigation: [
        {route: '/', icon: 'chart-line', label: 'Balance'},
        {route: '/credit_card_transactions', icon: 'chart-donut', label: 'Credit card'},
        {route: '/bank_account_transactions', icon: 'chart-donut', label: 'Bank'},
      ]
    }
  }
}
</script>


<style>

</style>
