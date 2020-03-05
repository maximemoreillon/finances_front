import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'balance',
    component: () => import('../views/BalanceHistory.vue')
  },
  {
    path: '/credit_card_transactions',
    name: 'credit_card_transactions',
    component: () => import('../views/CreditCardTransactions.vue')
  },
  {
    path: '/bank_account_transactions',
    name: 'bank_account_transactions',
    component: () => import('../views/BankAccountTransactions.vue')
  },
  {
    path: '/view_transaction',
    name: 'view_transaction',
    component: () => import('../views/ViewTransaction.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
