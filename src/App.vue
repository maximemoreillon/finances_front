<template>
  <div id="app">

    <AppTemplate applicationName="Finances">

      <template v-slot:navigation>
        <router-link to="/">
          <chart-line-icon />
          <span>Balance</span>
        </router-link>
        <router-link to="/credit_card_transactions">
          <chart-donut-icon />
          <span>Credit card</span>
        </router-link>
        <router-link to="/bank_account_transactions">
          <chart-donut-icon />
          <span>Bank</span>
        </router-link>
      </template>

    </AppTemplate>

  </div>
</template>

<script>
//import AppTemplate from '@/components/vue_application_template/AppTemplate.vue'
import AppTemplate from '@moreillon/vue_application_template'

import ChartDonutIcon from 'vue-material-design-icons/ChartDonut.vue';
import ChartLineIcon from 'vue-material-design-icons/ChartLine.vue';

export default {
  name: 'app',
  components: {
    AppTemplate,
    ChartDonutIcon,
    ChartLineIcon
  },

  data(){
    return {}
  }
}
</script>


<style>

</style>
